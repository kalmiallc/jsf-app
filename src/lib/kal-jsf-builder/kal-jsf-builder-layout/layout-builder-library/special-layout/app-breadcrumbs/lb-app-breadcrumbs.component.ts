import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-app-breadcrumbs',
  template       : `
      <div class="jsf-lb-app-breadcrumbs jsf-layout-app-breadcrumbs" [ngClass]="getLayoutEditorClass()">
          <div class="breadcrumbs-container">

              <div class="fragment __color--black-50">
                  <span class="fragment-name no-path">App</span>
                  <span class="fragment-separator">{{ separator }}</span>
                  <span class="fragment-name no-path">Page</span>
                  <span class="fragment-separator">{{ separator }}</span>
                  <span class="fragment-name no-path">Subpage</span>
              </div>

          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./lb-app-breadcrumbs.component.scss']
})
export class LbAppBreadcrumbsComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  get separator() {
    return this.layoutEditor.mutableDefinition.separator || '/';
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
