import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-default',
  template       : `
      <div class="jsf-lb-default" [ngClass]="getLayoutEditorClass()">
          <div class="__background-color--grey-light">
              <div class="min-h-12 d-flex justify-content-center align-items-center __color--black-30">
                  {{ layoutEditor.type }}
              </div>
              <div class="p-2" *ngIf="layoutEditor.supportsItems">
                  <div class="__background-color--white p-1">
                      <jsf-layout-builder-items-router
                              [parent]="layoutEditor"
                              [items]="layoutEditor.items">
                      </jsf-layout-builder-items-router>
                  </div>
              </div>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbDefaultComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
