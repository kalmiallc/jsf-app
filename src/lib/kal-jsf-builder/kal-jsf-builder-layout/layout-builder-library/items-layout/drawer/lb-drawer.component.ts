import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-drawer',
  template       : `
      <div class="jsf-lb-drawer" [ngClass]="getLayoutEditorClass()">
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
export class LbDrawerComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
