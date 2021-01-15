import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit
}                                                             from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { Overlay }                                            from '@angular/cdk/overlay';
import { Subject }                                            from 'rxjs';
import { JsfPropBuilder, JsfPropLayoutBuilder }               from '@kalmia/jsf-common-es2015';
import { JSF_FORM_CONTROL_ERRORS }                            from '../jsf-control-errors';
import { FileItem, FileUploader, ParsedResponseHeaders }      from 'ng2-file-upload';
import { takeUntil }                                          from 'rxjs/operators';
import { MatSnackBar }                                        from '@angular/material/snack-bar';
import * as qs from 'query-string';

export enum UploaderState {
  Initializing,
  AwaitingUpload,
  Uploading,
  PostUpload,
}

@Component({
  selector       : 'jsf-file-upload',
  templateUrl    : './jsf-file-upload.component.html',
  styleUrls      : ['./jsf-file-upload.component.scss'],
  providers      : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsfFileUploadComponent),
      multi      : true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfFileUploadComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private _value: string;
  get value() {
    return this._value;
  }

  set value(x: any) {
    this._value = x;
    this.propagateChange(this._value);
  }

  private _control: NgControl;

  readonly uploaderState = UploaderState;

  preSignedUpload: string;
  preSignedDownload: string;
  preSignedS3Path: string;
  uploadedFilename: string;

  uploader: FileUploader;

  state: UploaderState = UploaderState.Initializing;

  dropZoneOver         = false;
  uploadProgress       = 0;
  previewFileLoading = false;
  previewFileUrl;

  readonly imageLikeExtensions = [
    'apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp', 'bmp'
  ];


  @Input() title?: string;
  @Input() disabled?: boolean;

  @Input() uploadPath: string;
  @Input() allowedExtensions?: string[];

  @Input() apiService: any;

  @Input() reUploadLabel?: string          = $localize`Re-upload`;
  @Input() removeLabel?: string            = $localize`Remove`;
  @Input() uploadLabel?: string            = $localize`Upload`;
  @Input() uploadingLabel?: string         = $localize`Uploading`;
  @Input() uploadFailedLabel?: string      = $localize`Upload failed:`;
  @Input() allowedExtensionsLabel?: string = $localize`Allowed file types:`;
  @Input() dropFileLabel?: string          = $localize`Drop file here`;
  @Input() invalidFileTypeLabel?: string = $localize`Invalid file type.`;


  @Input() errorMap?: { [errorCode: string]: string };

  // Used internally by JSF
  @Input() layoutBuilder?: JsfPropLayoutBuilder<JsfPropBuilder>;
  @Input() showJsfErrors?: boolean;

  // Text for display in the component
  get allowedFileTypesText() {
    return this.allowedExtensions && this.allowedExtensions.map(x => `*.${ x }`).join(', ');
  }

  // Input mask for input element
  get allowedFileTypesInputString() {
    return this.allowedExtensions ? this.allowedExtensions.map(x => `.${ x }`).join(',') : '*';
  }

  get errors() {
    let errors = [];
    if (this.layoutBuilder) {
      errors = this.layoutBuilder.propBuilder.errors.map(x => x.interpolatedMessage);
    } else if (this._control) {
      for (const k of Object.keys(this._control.errors || {})) {
        if (!this._control.errors[k]) {
          continue;
        }

        let m: any;
        if (this.errorMap && this.errorMap[k]) {
          m = this.errorMap[k];
        } else if (this.defaultErrorMap[k]) {
          m = this.defaultErrorMap[k];
        } else {
          m = $localize`Field is invalid`;
        }

        errors.push(m(this._control.errors[k]));
      }
    }
    return errors;
  }

  get displayErrors() {
    if (this.layoutBuilder) {
      return this.showJsfErrors;
    } else if (this._control) {
      return this._control.touched || this._control.dirty;
    }
  }

  /**
   * Gets the filename with extension from extra parameters in the url.
   */
  get filenameWithExt() {
    let filenameWithExt;
    if (this.value) {
      const qsTokenString = this.value.split('?')[1];
      if (qsTokenString) {
        const qsTokens = qs.parse(qsTokenString);
        filenameWithExt = qsTokens.filenameWithExt;
      }
    }
    return filenameWithExt ?? '';
  }

  /**
   * Gets only the extension from extra parameters in the url.
   */
  get ext() {
    return this.filenameWithExt.split('.').pop();
  }

  /**
   * Gets only the filename from extra parameters in the url.
   */
  get filename() {
    return this.filenameWithExt.split(this.ext)[0];
  }

  /**
   * Gets the S3 path where the file is uploaded.
   */
  get s3path() {
    let path;
    if (this.value) {
      path = this.value.split('?')[0];
    }
    return path ?? '';
  }

  /**
   * Returns true if current file is uploaded in the tmp folder.
   */
  get isUploadedToTmp() {
    return this.s3path.startsWith('tmp/');
  }

  /**
   * Returns true if uploaded file is of an image type and can be displayed directly in the preview area.
   */
  get isImageLikeFile() {
    return this.imageLikeExtensions.indexOf(this.ext) > -1;
  }


  private propagateChange = (_: any) => {};

  constructor(private cdRef: ChangeDetectorRef,
              private injector: Injector,
              @Inject(JSF_FORM_CONTROL_ERRORS) private defaultErrorMap,
              private snackBar: MatSnackBar,
              protected overlay: Overlay) { }

  ngOnInit(): void {
    this._control = this.injector.get(NgControl);

    this.createUploader();

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  private createUploader() {
    this.apiService.get('common/storage/presigned-upload')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ preSignedUpload, preSignedDownload, s3Path, token }) => {
        console.log(preSignedUpload, preSignedDownload, s3Path, token);
        this.preSignedUpload = preSignedUpload;
        this.preSignedDownload = preSignedDownload;
        this.preSignedS3Path = s3Path;

        this.state = UploaderState.AwaitingUpload;

        this.uploader = new FileUploader({
          url             : this.preSignedUpload,
          disableMultipart: true,
          method          : 'PUT',
          autoUpload      : true
        });

        this.uploader.onAfterAddingFile  = (item: FileItem) => {
          console.log('onAfterAddingFile', item);

          // Check for valid extension
          if (this.allowedExtensions && this.allowedExtensions.length) {
            const ext = item.file.name.split('.').pop();
            console.log(ext);
            if (this.allowedExtensions.indexOf(ext) === -1) {
              this.snackBar.open(this.invalidFileTypeLabel, $localize`Close`, { duration: 5000 });
              return item.remove();
            }
          }

          item.withCredentials = false;
        };
        this.uploader.onBeforeUploadItem = (item: FileItem) => {
          console.log('onBeforeUploadItem', item);
          this.state = UploaderState.Uploading;

          this.uploadProgress = 0;

          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        };
        this.uploader.onProgressItem     = (item: FileItem, progress: number) => {
          console.log('onProgressItem', item, progress);
          this.uploadProgress = progress;

          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        };
        this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          console.log('onSuccessItem', item);
          this.state = UploaderState.PostUpload;

          this.uploadedFilename = item._file.name;
          this.value            = `${ this.preSignedS3Path }?${ qs.stringify({
            filenameWithExt: this.uploadedFilename,
            uploadPath: this.uploadPath
          }) }`;

          console.log('Value = ', this.value);

          this.updateUploadedFileUrl();

          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        };
        this.uploader.onErrorItem        = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          console.log('onErrorItem', item);
          this.state = UploaderState.AwaitingUpload;

          this.snackBar.open(this.uploadFailedLabel + ' ' + response, $localize`Close`, { duration: 5000 });

          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        };

        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  updateUploadedFileUrl() {
    if (!this.value) {
      return;
    }

    this.previewFileLoading = true;
    this.previewFileUrl = '';

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();

    if (this.isUploadedToTmp) {
      this.previewFileLoading = false;
      this.previewFileUrl = this.preSignedDownload;

      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    } else {
      this.apiService.get(`common/storage/presigned-download?path=${ this.s3path }&expiry=604800`, )
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(({ preSignedUrl }) => {
          this.previewFileLoading = false;
          this.previewFileUrl = preSignedUrl;

          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  fileOver(event: any) {
    this.dropZoneOver = event;
  }

  fileDrop(event: any) {
    this.dropZoneOver = false;
  }

  removeFile() {
    this.value = null;
    this.state = UploaderState.AwaitingUpload;
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  downloadPreviewFile() {
    if (this.previewFileUrl) {
      window.open(this.previewFileUrl, '_blank');
    }
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: any): void {
  }

  public writeValue(obj: any): void {
    this._value = obj;
    this.cdRef.detectChanges();
  }
}
