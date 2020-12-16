import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
}                                                  from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef }                     from '@angular/cdk/overlay';
import { TemplatePortal }                          from '@angular/cdk/portal';
import { merge, Subject }                          from 'rxjs';
import { takeUntil }                               from 'rxjs/operators';

@Component({
  selector   : 'jsf-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls  : ['./code-editor.component.scss'],
  providers  : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeEditorComponent),
      multi      : true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChild('codeEditorTemplate', { read: TemplateRef, static: false })
  codeEditorTemplate: TemplateRef<any>;

  @Input() language: string;
  @Input() errorMessage?: string;

  public editorOptions;

  private overlayRef: OverlayRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private _content: string;

  get content() {
    return this._content;
  }

  set content(x: string) {
    this._content = x;
    this.propagateChange(this._content);
  }

  private propagateChange = (_: any) => {};

  constructor(private cdRef: ChangeDetectorRef,
              protected vcRef: ViewContainerRef,
              protected overlay: Overlay) { }

  ngOnInit(): void {
    this.editorOptions = {
      theme          : 'vs-dark',
      language       : this.language,
      automaticLayout: true
    };
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  public openCodeEditor() {
    this.overlayRef = this.overlay.create({
      // Position strategy defines where popup will be displayed
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      // Popup reposition on scroll
      scrollStrategy  : this.overlay.scrollStrategies.reposition(),

      hasBackdrop: true,
      width      : '80vw',
      height     : '90vh'
    });

    // Put template to a portal
    const templatePortal = new TemplatePortal(this.codeEditorTemplate, this.vcRef);

    // Attach the portal to the overlay
    this.overlayRef.attach(templatePortal);

    // Handle closing
    merge(
      this.overlayRef.backdropClick(),
      this.overlayRef.detachments()
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.overlayRef.dispose();
      });
  }

  public closeCodeEditor() {
    this.overlayRef.dispose();
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: any): void {
  }

  public writeValue(obj: any): void {
    this._content = obj;
    this.cdRef.detectChanges();
  }

}
