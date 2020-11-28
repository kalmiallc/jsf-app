import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-icon',
  template       : `
      <jsf-icon class="jsf-lb-icon"
                [ngClass]="getLayoutEditorClass()"
                [icon]="icon"
                [size]="size">
      </jsf-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbIconComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

  get icon(): string {
    return this.layout.icon || 'help';
  }

  get color(): string {
    return this.layout.color;
  }

  get size(): string {
    return this.layout.size;
  }

}
