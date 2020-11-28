import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { JsfLayoutPoweredBy, JsfSpecialLayoutBuilder }                                  from '@kalmia/jsf-common-es2015';
import { AbstractSpecialLayoutComponent }                                               from '../../../abstract/special-layout.component';
import { BuilderDeveloperToolsInterface }                                               from '../../../builder-developer-tools.interface';
import { JSF_APP_CONFIG, JsfAppConfig }                                                 from '../../../../common';

@Component({
  selector       : 'jsf-layout-powered-by',
  template       : `
      <div class="jsf-layout-powered-by jsf-animatable __color--black" [ngClass]="htmlClass" (click)="handleLayoutClick($event)">
          <div class="powered-by-container" (click)="navigateToWebsite()">
              <span i18n class="powered-by-label">Powered by</span>
              <img class="powered-by-logo" src="./assets/branding/powered-by.png">
          </div>
      </div>
  `,
  styleUrls      : ['./powered-by.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutPoweredByComponent extends AbstractSpecialLayoutComponent<JsfLayoutPoweredBy> implements OnInit {

  @Input()
  layoutBuilder: JsfSpecialLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  constructor(private cdRef: ChangeDetectorRef,
              @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig) {
    super();
  }

  public ngOnInit(): void {}

  navigateToWebsite() {
    return this.layoutBuilder.rootBuilder.appRouter.navigateTo(this.jsfAppConfig.poweredByUrl, {
      type: 'absolute'
    });
  }
}
