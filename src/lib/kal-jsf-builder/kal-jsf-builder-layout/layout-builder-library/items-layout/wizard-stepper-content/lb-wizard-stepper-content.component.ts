import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                                from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                 from '../../../abstract/abstract-layout-builder.component';
import { LbWizardComponent }                                                              from '../wizard/lb-wizard.component';
import { takeUntil }                                                                      from 'rxjs/operators';


interface StepLayoutInterface {
  stepIds: string[];
  layoutEditors: JsfLayoutEditor[];
}

@Component({
  selector       : 'jsf-lb-wizard-stepper-content',
  template       : `
      <div class="jsf-lb-wizard-stepper-content __background-color--primary-10 rounded-sm p-1" [ngClass]="getLayoutEditorClass()">
          <span class="text-center d-block">Wizard stepper content</span>
          <div class="jsf-lb-wizard-stepper-content-steps-container __background-color--white rounded-sm p-1">
              <jsf-layout-builder-items-router
                      [parent]="layoutEditor"
                      [items]="layoutEditor.items">
              </jsf-layout-builder-items-router>
              
              <ng-container *ngFor="let stepLayout of stepLayouts">

              </ng-container>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbWizardStepperContentComponent extends AbstractLayoutBuilderComponent implements OnInit {

  @Input()
  layoutEditor: JsfLayoutEditor;

  private _stepLayouts: StepLayoutInterface[];
  get stepLayouts() {
    return this._stepLayouts;
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef,
    @SkipSelf() public wizard: LbWizardComponent
  ) {
    super(cdRef, parentCdRef);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.updateStepLayouts();

    this.wizard.update$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  isStepLayoutSelected(stepLayout: StepLayoutInterface) {
    for (const stepId of (stepLayout.stepIds || [])) {
      if (this.wizard.isStepSelected({ id: stepId })) {
        return true;
      }
    }
    return false;
  }

  private updateStepLayouts() {
    this._stepLayouts = this.layoutEditor.items.filter(x => x.type === 'wizard-step').map(x => {
      return {
        stepIds      : x.mutableDefinition.stepIds,
        layoutEditors: x.items
      };
    }) as any;

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }
}
