import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SkipSelf } from '@angular/core';
import { JsfLayoutWizardStepperHeader, JsfSpecialLayoutBuilder }                          from '@kalmia/jsf-common-es2015';
import { AbstractSpecialLayoutComponent }                                                 from '../../../abstract/special-layout.component';
import { BuilderDeveloperToolsInterface }                                                 from '../../../builder-developer-tools.interface';
import { LayoutWizardComponent }                                                          from '../../items-layout/wizard/wizard.component';
import { takeUntil }                                                                      from 'rxjs/operators';
import { JsfResponsiveService }                                                           from '../../../services/responsive.service';


@Component({
  selector       : 'jsf-layout-wizard-stepper-header',
  template       : `
      <div class="jsf-layout-wizard-stepper-header"
           [class.desktop-layout]="isDesktopLayoutBreakpointActive()">
          <div class="jsf-layout-wizard-stepper-header-container">
              <ng-container *ngIf="isDesktopLayoutBreakpointActive(); else mobileLayout">
                  <ng-container *ngFor="let step of wizard.steps">
                      <div class="jsf-layout-wizard-stepper-header-step"
                           [class.selected]="wizard.isStepSelected(step)"
                           [class.invalid]="wizard.isStepErrorStateVisible(step) && !wizard.isStepInValidState(step)"
                           (click)="wizard.selectStep(step)">
                          <div class="jsf-layout-wizard-stepper-header-step-labels d-flex align-items-center rounded">
                              <div class="wizard-step-index">
                                  <jsf-icon *ngIf="wizard.isStepErrorStateVisible(step) && !wizard.isStepInValidState(step)"
                                            [icon]="'warning'"
                                            [size]="'24px'">
                                  </jsf-icon>
                              </div>
                              <div class="wizard-step-name">
                                  <span class="d-block">{{ wizard.getStepIndex(step) + 1 }}. {{ wizard.getStepName(step) }}</span>
                                  <span class="d-block small wizard-step-name-error" *ngIf="wizard.isStepErrorStateVisible(step) && !wizard.isStepInValidState(step)" i18n>Some fields are invalid</span>
                              </div>
                          </div>
                      </div>
                  </ng-container>
              </ng-container>

              <ng-template #mobileLayout>
                  <div class="jsf-layout-wizard-stepper-header-collapsed"
                       [class.invalid]="wizard.isStepErrorStateVisible(wizard.selectedStep) && !wizard.isStepInValidState(wizard.selectedStep)">
                      <jsf-icon *ngIf="wizard.isStepErrorStateVisible(wizard.selectedStep) && !wizard.isStepInValidState(wizard.selectedStep)"
                                [icon]="'warning'"
                                [size]="'24px'"
                                class="pr-2">
                      </jsf-icon>
                      <span i18n>Step {{ getSelectedStepIndex() + 1 }} of {{ wizard.steps.length }}</span>
                  </div>
              </ng-template>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : [`./wizard-stepper-header.component.scss`]
})
export class LayoutWizardStepperHeaderComponent extends AbstractSpecialLayoutComponent<JsfLayoutWizardStepperHeader> implements OnInit {

  @Input()
  layoutBuilder: JsfSpecialLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  constructor(private cdRef: ChangeDetectorRef,
              private responsiveService: JsfResponsiveService,
              @SkipSelf() public wizard: LayoutWizardComponent) {
    super();
  }

  ngOnInit(): void {
    this.wizard.update$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  getSelectedStepIndex() {
    return this.wizard.getStepIndex(this.wizard.selectedStep);
  }

  public isDesktopLayoutBreakpointActive() {
    const breakpoint = (this.layoutBuilder?.layout as any)?.breakpoints?.desktopLayout || 'sm';
    return this.responsiveService.isBreakpointMatched(breakpoint);
  }
}
