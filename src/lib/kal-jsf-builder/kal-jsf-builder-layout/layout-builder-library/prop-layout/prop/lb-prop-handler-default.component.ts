import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractPropHandlerLayoutBuilderComponent }                              from '../../../abstract/abstract-prop-handler-layout-builder.component';


@Component({
  selector       : 'jsf-lb-prop-handler-default',
  template       : `
      <div class="jsf-lb-prop-handler-default" [ngClass]="getLayoutEditorClass()">
          <div class="__background-color--grey-light">
              <div class="min-h-12 d-flex justify-content-center align-items-center flex-column __color--black-30">
                  <span class="font-weight-medium text-truncate d-block">Form Control [{{ prop?.editorType }}] - {{ prop?.handlerType }}</span>
                  <span class="text-truncate d-block">{{ prop?.path }}</span>
              </div>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbPropHandlerDefaultComponent extends AbstractPropHandlerLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
