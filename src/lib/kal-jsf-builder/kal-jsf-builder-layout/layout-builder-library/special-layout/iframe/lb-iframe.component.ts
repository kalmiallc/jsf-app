import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SkipSelf } from '@angular/core';
import { JsfLayoutEditor, JsfLayoutIframe }                                                                from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                 from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-iframe',
  template       : `
      <div *ngIf="src" class="jsf-lb-iframe" [ngClass]="getLayoutEditorClass()">
        {{ src }}
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbIframeComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  get src() {
    const src = (this.layout as JsfLayoutIframe).src;
    if (src.trim().startsWith('<')) {
      return  'data:text/html,' + encodeURIComponent(src);
    }
    return src;
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
