import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                                from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                 from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-wizard-section',
  template       : `
      <div class="jsf-lb-wizard-section __background-color--grey-light" [ngClass]="getLayoutEditorClass()">
        <div class="text-center py-3">
            <span class="font-size-h3 font-weight-medium d-block">{{ sectionType }}</span>
            <span *ngIf="sectionStepIds.length">({{ sectionStepIds.join(', ') }})</span>
        </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbWizardSectionComponent extends AbstractLayoutBuilderComponent implements OnInit {


  @Input()
  layoutEditor: JsfLayoutEditor;

  get sectionType() {
    return this.layoutEditor.mutableDefinition.sectionType.toUpperCase();
  }

  get sectionStepIds() {
    return (this.layoutEditor.mutableDefinition.sectionOptions?.stepIds || []);
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }
}
