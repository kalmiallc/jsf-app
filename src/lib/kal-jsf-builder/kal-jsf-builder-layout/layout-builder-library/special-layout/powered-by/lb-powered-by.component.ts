import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                                from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                 from '../../../abstract/abstract-layout-builder.component';
import { JSF_APP_CONFIG, JsfAppConfig }                                                   from '../../../../../common';


@Component({
  selector       : 'jsf-lb-powered-by',
  template       : `    
      <div class="jsf-lb-powered-by jsf-layout-powered-by jsf-animatable __color--black" [ngClass]="getLayoutEditorClass()">
          <div class="powered-by-container">
              <span i18n class="powered-by-label">Powered by</span>
              <img class="powered-by-logo" src="./assets/branding/powered-by.png">
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./lb-powered-by.component.scss']
})
export class LbPoweredByComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef,
    @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig
  ) {
    super(cdRef, parentCdRef);
  }

}
