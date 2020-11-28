import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-render-2d',
  template       : `
      <div class="jsf-lb-render-3d" [ngClass]="getLayoutEditorClass()">
          <div class="jsf-lb-render-3d-placeholder __background-color--grey-light d-flex justify-content-center align-items-center"
               [style.width]="width"
               [style.height]="height"
               [style.background-image]="background">
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
      `
          .jsf-lb-render-3d-placeholder {
              min-height: 110px;
              background-size: 100px;
              background-position: center;
              background-repeat: no-repeat;
          }
    `
  ]
})
export class LbRender3DComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  get width() {
    return this.layoutEditor.mutableDefinition.width || '100%';
  }

  get height() {
    return this.layoutEditor.mutableDefinition.height || '100%';
  }

  get icon() {
    return this.layoutEditor.info.icon;
  }

  get background() {
    return `url("./assets/builder/${ this.icon }")`;
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
