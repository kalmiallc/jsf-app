import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { JsfAbstractPageDataService, JsfLayoutAppBreadcrumbs, JsfSpecialLayoutBuilder } from '@kalmia/jsf-common-es2015';
import { AbstractSpecialLayoutComponent }                                               from '../../../abstract/special-layout.component';
import { JSF_APP_PAGE_DATA }                                                            from '../../../../common';
import { BuilderDeveloperToolsInterface }                                               from '../../../builder-developer-tools.interface';

@Component({
  selector       : 'jsf-layout-app-breadcrumbs',
  template       : `
      <div class="jsf-layout-app-breadcrumbs jsf-animatable" [ngClass]="htmlClass" (click)="handleLayoutClick($event)">
          <div class="breadcrumbs-container">

              <div class="fragment __color--black-50" *ngFor="let fragment of fragments; let last = last">
                  <!-- Fragment name -->
                  <ng-container *ngIf="fragment.path; else noPathFragmentName">
                        <span class="fragment-name"
                              jsfHoverClass="__color--primary"
                              (click)="navigateTo(fragment.path)">
                          {{ i18n(fragment.label) }}
                        </span>
                  </ng-container>
                  
                  <ng-template #noPathFragmentName>
                      <span class="fragment-name no-path">
                          {{ i18n(fragment.label) }}
                        </span>
                  </ng-template>

                  <!-- Separator -->
                  <span class="fragment-separator" *ngIf="!last">{{ separator }}</span>
              </div>

          </div>
      </div>
  `,
  styleUrls      : ['./app-breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutAppBreadcrumbsComponent extends AbstractSpecialLayoutComponent<JsfLayoutAppBreadcrumbs> implements OnInit {

  @Input()
  layoutBuilder: JsfSpecialLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  get separator() {
    return this.layout.separator || '/';
  }

  get fragments() {
    return this.pageDataService.getActiveBreadcrumbs();
  }

  constructor(private cdRef: ChangeDetectorRef,
              @Inject(JSF_APP_PAGE_DATA) private pageDataService: JsfAbstractPageDataService) {
    super();
  }

  ngOnInit(): void {
  }

  navigateTo(path: string) {
    return this.layoutBuilder.rootBuilder.appRouter.navigateTo(path, {
      type: 'app'
    });
  }

}
