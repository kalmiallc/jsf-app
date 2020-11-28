import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';
import { DomSanitizer }                                                           from '@angular/platform-browser';


@Component({
  selector       : 'jsf-lb-image',
  template       : `
      <div class="no-image-container border border-style-dashed __border-color--warn __color--warn d-inline-block" *ngIf="!src">
        <mat-icon aria-hidden="false">insert_photo</mat-icon><br>
        No image source set.
      </div>

      <div class="no-image-container border border-style-dashed d-inline-block" *ngIf="isDynamicImage; else staticImage">
        <mat-icon aria-hidden="false">insert_photo</mat-icon><br>
        Dynamic image
      </div>
      
      <ng-template #staticImage>
          <ng-container *ngIf="!displayAsBackgroundImage">
              <img class="jsf-lb-image jsf-layout-image jsf-animatable jsf-lb-image jsf-layout-image-display-mode-image"
                   [ngClass]="getLayoutEditorClass()"
                   *ngIf="src"
                   [src]="src"
                   [style.width]="width || ''"
                   [style.height]="height || ''"/>
          </ng-container>

          <ng-container *ngIf="displayAsBackgroundImage">
              <div class="jsf-lb-image jsf-layout-image jsf-animatable jsf-lb-image jsf-layout-image-display-mode-background"
                   [ngClass]="getLayoutEditorClass()"
                   *ngIf="src"
                   [style.width]="width || ''"
                   [style.height]="height || ''"
                   [style.background-image]="getBackgroundImageStyle(src)"
                   [style.background-position]="'center'"
                   [style.background-size]="'cover'">
              </div>
          </ng-container>
      </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
    `.no-image-container {
      text-align: center;
      padding: 20px;
    }`
  ]
})
export class LbImageComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  getBackgroundImageStyle(url: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${ url }')`);
  }

  get src(): any {
    return this.layout.src;
  }

  get width(): string {
    return this.layout.width;
  }

  get height(): string {
    return this.layout.height;
  }

  get displayAsBackgroundImage(): boolean {
    return !!this.layout.displayAsBackgroundImage;
  }

  get isDynamicImage() {
    return this.src && this.isEvalObject(this.src);
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef,
    protected sanitizer: DomSanitizer
  ) {
    super(cdRef, parentCdRef);
  }

  private isEvalObject(x: any): x is { $eval: string, dependencies?: string[] } {
    return typeof x === 'object' && '$eval' in x;
  }

}
