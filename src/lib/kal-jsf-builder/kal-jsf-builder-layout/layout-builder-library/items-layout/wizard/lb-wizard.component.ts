import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SkipSelf } from '@angular/core';
import { JsfLayoutEditor, JsfLayoutPropStringPreferences, JsfWizardStep }                 from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                 from '../../../abstract/abstract-layout-builder.component';
import { Subject }                                                                        from 'rxjs/internal/Subject';
import { Observable }                                                                     from 'rxjs/internal/Observable';


@Component({
  selector       : 'jsf-lb-wizard',
  template       : `
      <div class="jsf-lb-wizard" [ngClass]="getLayoutEditorClass()">
          <div class="d-flex justify-content-between align-items-center">
              <div class="jsf-lb-wizard-title">🧙 Wizard</div>
              <div class="jsf-lb-wizard-step-picker d-flex">
                  <mat-form-field [color]="themePreferences.color"
                                  [appearance]="themePreferences.appearance"
                                  [class.jsf-mat-form-field-variant-standard]="isVariantStandard()"
                                  [class.jsf-mat-form-field-variant-small]="isVariantSmall()"
                                  jsfOutlineGapAutocorrect>
                      <ng-container *ngIf="dynamicStepsEnabled; else staticStepPicker">
                          <input matInput
                                 type="string"
                                 placeholder="Active step ID"
                                 [(ngModel)]="selectedStepId">
                      </ng-container>

                      <ng-template #staticStepPicker>
                          <mat-select>
                              <mat-option *ngFor="let step of steps" [value]="step.id">
                                  {{ step.title || step.id }}
                              </mat-option>
                          </mat-select>
                      </ng-template>
                  </mat-form-field>

                  <button mat-icon-button (click)="toggleAllSectionVisibility()" [class.__color--primary]="allSectionsVisible">
                      <mat-icon>remove_red_eye</mat-icon>
                  </button>
              </div>
          </div>

          <div class="jsf-lb-wizard-wrapper">
              <div class="jsf-lb-wizard-top">
                  <ng-container *ngFor="let section of topSections">
                      <div class="jsf-lb-wizard-header"
                           *ngIf="isSectionVisible(section)">
                          <jsf-layout-builder-items-router
                                  *ngIf="section.supportsItems"
                                  [parent]="section"
                                  [items]="section.items">
                          </jsf-layout-builder-items-router>
                      </div>
                  </ng-container>
              </div>
              <div class="jsf-lb-wizard-center">
                  <ng-container *ngFor="let section of centerSections">
                      <div [class.jsf-lb-wizard-sidebar]="section.mutableDefinition.sectionType === 'sidebar'"
                           [class.jsf-lb-wizard-content]="section.mutableDefinition.sectionType === 'content'"
                           *ngIf="isSectionVisible(section)">
                          <jsf-layout-builder-items-router
                                  *ngIf="section.supportsItems"
                                  [parent]="section"
                                  [items]="section.items">
                          </jsf-layout-builder-items-router>
                      </div>
                  </ng-container>
              </div>
              <div class="jsf-lb-wizard-bottom">
                  <ng-container *ngFor="let section of bottomSections">
                      <div class="jsf-lb-wizard-footer"
                           *ngIf="isSectionVisible(section)">
                          <jsf-layout-builder-items-router
                                  *ngIf="section.supportsItems"
                                  [parent]="section"
                                  [items]="section.items">
                          </jsf-layout-builder-items-router>
                      </div>
                  </ng-container>
              </div>
          </div>
      </div>

      <ng-template #actionBarTemplate>


      </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./lb-wizard.component.scss']
})
export class LbWizardComponent extends AbstractLayoutBuilderComponent implements OnInit {

  @Input()
  layoutEditor: JsfLayoutEditor;

  /**
   * Sections to display in the header.
   */
  topSections: JsfLayoutEditor[];
  /**
   * Sections to display in the center.
   */
  centerSections: JsfLayoutEditor[];
  /**
   * Sections to display in the bottom.
   */
  bottomSections: JsfLayoutEditor[];

  dynamicStepsEnabled: boolean;

  allSectionsVisible = false;

  private _update: Subject<void> = new Subject<void>();

  get update$(): Observable<void> {
    return this._update.asObservable();
  }

  private _selectedStep: JsfWizardStep;
  get selectedStep(): JsfWizardStep {
    return this._selectedStep;
  }

  private _steps: JsfWizardStep[];
  get steps(): JsfWizardStep[] {
    return this._steps;
  }

  private _selectedStepId: string;
  set selectedStepId(x: string) {
    this._selectedStepId = x;
    this.selectStep({
      id: x
    });
  }

  get selectedStepId() {
    return this._selectedStepId;
  }

  toggleAllSectionVisibility() {
    this.allSectionsVisible = !this.allSectionsVisible;
    this.detectChanges();
  }


  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }


  public ngOnInit(): void {
    super.ngOnInit();

    this.updateSections();
    this.updateSteps();
  }

  private updateSections() {
    this.topSections = (this.layoutEditor.items as JsfLayoutEditor[])
      .filter(x => x.type === 'wizard-section' && x.mutableDefinition.sectionType === 'header');

    this.centerSections = (this.layoutEditor.items as JsfLayoutEditor[])
      .filter(x => x.type === 'wizard-section' && (x.mutableDefinition.sectionType === 'content' || x.mutableDefinition.sectionType === 'sidebar'));

    this.bottomSections = (this.layoutEditor.items as JsfLayoutEditor[])
      .filter(x => x.type === 'wizard-section' && x.mutableDefinition.sectionType === 'footer');
  }

  private updateSteps() {
    if (this.isEvalObject(this.layout.steps)) {
      this._steps              = [];
      this.dynamicStepsEnabled = true;
    } else {
      this._steps              = this.layout.steps;
      this.dynamicStepsEnabled = false;
      this.selectStep(this._steps[0]);
    }

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public isSectionVisible(section: JsfLayoutEditor) {
    if (this.allSectionsVisible) {
      return true;
    }

    if (section?.mutableDefinition?.sectionOptions?.stepIds) {
      for (const stepId of section.mutableDefinition.sectionOptions.stepIds) {
        if (this.isStepSelected({ id: stepId })) {
          return true;
        }
      }

      return false;
    }
    return true;
  }

  public isStepSelected(step: JsfWizardStep) {
    if (this.allSectionsVisible) {
      return true;
    }

    return this.selectedStep && step && this.selectedStep.id === step.id;
  }

  public selectStep(step: JsfWizardStep, options?: { skipUpdateErrorState?: boolean }) {
    this._selectedStep   = step;
    this._selectedStepId = step.id;

    this._update.next();

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();

    return true;
  }

  private isEvalObject(x: any): x is { $eval: string, dependencies?: string[] } {
    return typeof x === 'object' && '$eval' in x;
  }

  get themePreferences(): JsfLayoutPropStringPreferences {
    return {
      /* Defaults */
      appearance : 'outline',
      color      : 'primary',
      variant    : 'small',
      clearable  : false,
      prefixIcon : '',
      prefixLabel: '',
      suffixIcon : '',
      suffixLabel: '',

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutPropStringPreferences;
  }

  isVariantStandard = () => this.themePreferences.variant === 'standard';
  isVariantSmall    = () => this.themePreferences.variant === 'small';

}
