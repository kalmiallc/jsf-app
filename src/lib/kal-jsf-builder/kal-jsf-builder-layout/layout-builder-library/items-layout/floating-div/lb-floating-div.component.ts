import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-floating-div',
  template       : `
      <div class="jsf-lb-floating-div" [ngClass]="getLayoutEditorClass()">
          <jsf-layout-builder-items-router
                  *ngIf="layoutEditor.supportsItems"
                  [parent]="layoutEditor"
                  [items]="layoutEditor.items">
          </jsf-layout-builder-items-router>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbFloatingDivComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
