import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-progress-bar',
  template       : `
      <mat-progress-bar [ngClass]="getLayoutEditorClass()"
                        [mode]="mode"
                        [color]="color"
                        [value]="progressValue"
                        class="jsf-lb-progress-bar jsf-layout-progress-bar jsf-animatable">
      </mat-progress-bar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbProgressBarComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

  get mode(): 'determinate' | 'indeterminate' | 'buffer' | 'query' {
    return this.layout.mode || 'determinate';
  }

  get color() {
    return this.layout.color || 'primary';
  }

  get progressValue() {
    return 33;
  }


}
