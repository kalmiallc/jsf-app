import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SkipSelf } from '@angular/core';
import { AbstractItemsLayoutComponent }                                                                             from '../../../abstract/items-layout.component';
import {
  getLayoutChildAbstractPropKeys,
  JsfAbstractItemsLayoutBuilder,
  JsfItemsLayoutBuilder,
  JsfLayoutWizardStep,
  JsfLayoutWizardStepperContent
}                                                                                                                   from '@kalmia/jsf-common-es2015';
import { BuilderDeveloperToolsInterface }                                                                           from '../../../builder-developer-tools.interface';
import { LayoutWizardComponent }                                                                                    from '../wizard/wizard.component';
import { takeUntil }                                                                                                from 'rxjs/operators';

interface StepLayoutInterface {
  stepIds: string[];
  layoutBuilder: JsfAbstractItemsLayoutBuilder<JsfLayoutWizardStep>;
}

@Component({
  selector       : 'jsf-layout-wizard-stepper-content',
  template       : `
      <div class="jsf-layout-wizard-stepper-content jsf-animatable"
           [ngClass]="getLayoutInnerClass()"
           [ngStyle]="getLayoutInnerStyle()"
           (click)="handleLayoutClick($event)">
          <div class="jsf-layout-wizard-stepper-content-steps-container">
              <ng-container *ngFor="let stepLayout of stepLayouts">
                  <div *ngIf="isStepLayoutSelected(stepLayout)"
                       class="jsf-layout-wizard-step jsf-animatable"
                       [class.invalid]="!isStepLayoutValid(stepLayout)"
                       #jsfShowValidationMessages="jsfShowValidationMessages"
                       [jsfShowValidationMessages]="isStepLayoutErrorStateVisible(stepLayout)">
                      <jsf-layout-router *ngFor="let item of stepLayout.layoutBuilder.items"
                                         [layoutBuilder]="item"
                                         [developerTools]="developerTools"
                                         [ngClass]="getLayoutItemClass(item)"
                                         [ngStyle]="getLayoutItemStyle(item)">
                      </jsf-layout-router>
                  </div>
              </ng-container>
          </div>

      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./wizard-stepper-content.component.scss']
})
export class LayoutWizardStepperContentComponent extends AbstractItemsLayoutComponent<JsfLayoutWizardStepperContent> implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  layoutBuilder: JsfItemsLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  private _stepLayouts: StepLayoutInterface[];
  get stepLayouts() {
    return this._stepLayouts;
  }

  constructor(private cdRef: ChangeDetectorRef,
              @SkipSelf() public wizard: LayoutWizardComponent) {
    super();
  }

  public ngOnInit(): void {
    this.updateStepLayouts();
    this.registerSteps();

    this.wizard.update$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }


  public ngAfterViewInit(): void {
  }


  public ngOnDestroy(): void {
    this.unregisterStepLayouts();
    super.ngOnDestroy();
  }

  isStepLayoutSelected(stepLayout: StepLayoutInterface) {
    for (const stepId of (stepLayout.stepIds || [])) {
      if (this.wizard.isStepSelected(this.wizard.getStepById(stepId))) {
        return true;
      }
    }
    return false;
  }

  isStepLayoutValid(stepLayout: StepLayoutInterface) {
    for (const stepId of (stepLayout.stepIds || [])) {
      if (!this.wizard.isStepInValidState(this.wizard.getStepById(stepId))) {
        return false;
      }
    }
    return true;
  }

  isStepLayoutErrorStateVisible(stepLayout: StepLayoutInterface) {
    for (const stepId of (stepLayout.stepIds || [])) {
      if (this.wizard.isStepErrorStateVisible(this.wizard.getStepById(stepId))) {
        return true;
      }
    }
    return false;
  }

  private updateStepLayouts() {
    this._stepLayouts = (this.layoutBuilder.items as any[]).filter(x => x.type === 'wizard-step').map(x => {
      return {
        stepIds      : x.layout.stepIds,
        layoutBuilder: x
      };
    });
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }


  private registerSteps() {
    for (const step of this._stepLayouts) {
      const stepPropKeys = getLayoutChildAbstractPropKeys(step.layoutBuilder.layout);
      for (const stepId of (step.stepIds || [])) {
        this.wizard.registerStepPropKeys(stepId, stepPropKeys);
      }
    }
  }

  private unregisterStepLayouts() {

  }
}
