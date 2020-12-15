import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                                from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                 from '../../../abstract/abstract-layout-builder.component';
import { LbWizardComponent }                                                              from '../wizard/lb-wizard.component';
import { takeUntil }                                                                      from 'rxjs/operators';
import { LbWizardStepperContentComponent }                                                from '../wizard-stepper-content/lb-wizard-stepper-content.component';


@Component({
  selector       : 'jsf-lb-wizard-step',
  template       : `
      <div class="jsf-lb-wizard-step" [ngClass]="getLayoutEditorClass()">
          <ng-container *ngIf="wizardStepperContent.isStepLayoutSelected(stepLayout); else collapsedStepTemplate">
              <jsf-layout-builder-items-router
                      [parent]="layoutEditor"
                      [items]="layoutEditor.items">
              </jsf-layout-builder-items-router>
          </ng-container>
          
          <ng-template #collapsedStepTemplate>
              <div class="jsf-lb-wizard-step-collapsed text-center __background-color--primary-10 rounded-sm p-1">
                  <span>Step ({{ (this.layoutEditor.mutableDefinition.stepIds || []).join(', ') }})</span>
              </div>
          </ng-template>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbWizardStepComponent extends AbstractLayoutBuilderComponent implements OnInit {

  @Input()
  layoutEditor: JsfLayoutEditor;

  get stepLayout() {
    return {
      stepIds      : this.layoutEditor.mutableDefinition.stepIds,
      layoutEditors: this.layoutEditor.items
    };
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef,
    @SkipSelf() public wizardStepperContent: LbWizardStepperContentComponent,
    @SkipSelf() public wizard: LbWizardComponent
  ) {
    super(cdRef, parentCdRef);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.wizard.update$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

}
