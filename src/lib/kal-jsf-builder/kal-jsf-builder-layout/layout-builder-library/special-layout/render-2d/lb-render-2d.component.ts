import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-render-2d',
  template       : `
      <div class="jsf-lb-render-2d" [ngClass]="getLayoutEditorClass()">
          <div class="jsf-lb-render-2d-placeholder __background-color--grey-light __color--black-30 d-flex justify-content-center align-items-center">
              <h2>Render2D</h2>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
      `
          .jsf-lb-render-2d-placeholder {
              height: 200px;
          }
    `
  ]
})
export class LbRender2DComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
