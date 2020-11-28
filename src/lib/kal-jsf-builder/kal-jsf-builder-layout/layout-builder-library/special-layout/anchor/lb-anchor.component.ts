import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-anchor',
  template       : `
      <a class="jsf-animatable" [ngClass]="getLayoutEditorClass()" href="javascript:void(0)">{{ title }}</a>

      <ng-template #actionBarTemplate>
          <jsf-kal-jsf-builder-action-bar-button icon="format_bold" [active]="hasHtmlClass('font-weight-bold')" (click)="toggleHtmlClass('font-weight-bold')"></jsf-kal-jsf-builder-action-bar-button>
          <jsf-kal-jsf-builder-action-bar-button icon="format_italic" [active]="hasHtmlClass('font-italic')" (click)="toggleHtmlClass('font-italic')"></jsf-kal-jsf-builder-action-bar-button>
          <jsf-kal-jsf-builder-action-bar-button icon="format_underline" [active]="hasHtmlClass('text-decoration-underline')" (click)="toggleHtmlClass('text-decoration-underline')"></jsf-kal-jsf-builder-action-bar-button>
      </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbAnchorComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  get title(): string {
    return this.layoutEditor.mutableDefinition.title || 'Link';
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
