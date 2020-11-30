import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  ViewChild
}                                                   from '@angular/core';
import { AbstractItemsLayoutComponent }             from '../../../abstract/items-layout.component';
import {
  JsfAbstractItemsLayoutBuilder,
  JsfItemsLayoutBuilder,
  JsfLayoutWizard,
  JsfLayoutWizardSection,
  JsfWizardStep,
  LayoutMode,
  PropStatus,
  PropStatusChangeInterface
}                                                   from '@kalmia/jsf-common-es2015';
import { BuilderDeveloperToolsInterface }           from '../../../builder-developer-tools.interface';
import { JsfResponsiveService }                     from '../../../services/responsive.service';
import { takeUntil }                                from 'rxjs/operators';
import { jsfDefaultScrollOptions }                  from '../../../../utilities';
import { ShowValidationMessagesDirective }          from '../../../directives/show-validation-messages.directive';
import { uniq }                                     from 'lodash';
import { Observable, Subject }                      from 'rxjs';
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';


interface ResizeObserverInterface {
  observe(target: HTMLElement, options?: { box: 'content-box' | 'border-box' });

  unobserve(target: HTMLElement);

  disconnect();
}

// Use polyfilled ResizeObserver if native browser version is not present.
const ResizeObserver = (window as any).ResizeObserver || ResizeObserverPolyfill;

@Component({
  selector       : 'jsf-layout-wizard',
  template       : `
      <div class="jsf-layout-wizard jsf-animatable"
           [id]="id"
           [class.native-frame]="isInsideNativeFrame()"
           [ngClass]="getLayoutInnerClass()"
           [ngStyle]="getLayoutInnerStyle()"
           (click)="handleLayoutClick($event)"
           #wizardElement>
          <div class="jsf-layout-wizard-wrapper">
              <div class="jsf-layout-wizard-top">
                  <ng-container *ngFor="let section of topSections">
                      <div class="jsf-layout-wizard-header"
                           *ngIf="isSectionVisible(section)"
                           [class.desktop-layout]="isDesktopLayoutBreakpointActive()"
                           [class.jsf-layout-wizard-no-styles]="section.layout.sectionOptions?.noStyles">
                          <ng-container *ngFor="let item of section.items">
                              <jsf-layout-router *ngIf="item.visible"
                                                 [layoutBuilder]="item"
                                                 [developerTools]="developerTools"
                                                 [ngClass]="getLayoutItemClass(item)"
                                                 [ngStyle]="getLayoutItemStyle(item)">
                              </jsf-layout-router>
                          </ng-container>
                      </div>
                  </ng-container>
              </div>

              <div class="jsf-layout-wizard-center"
                   [class.desktop-layout]="isDesktopLayoutBreakpointActive()">
                  <!-- Desktop layout with side-by-side content -->
                  <ng-container *ngIf="isDesktopLayoutBreakpointActive(); else mobileLayout">
                      <ng-container *ngFor="let section of centerSections">
                          <div class="jsf-layout-wizard-center-item"
                               *ngIf="isSectionVisible(section)"
                               [class.desktop-layout]="isDesktopLayoutBreakpointActive()"
                               [class.jsf-layout-wizard-content]="section.layout.sectionType === 'content'"
                               [class.jsf-layout-wizard-sidebar]="section.layout.sectionType === 'sidebar'"
                               [class.jsf-layout-wizard-no-styles]="section.layout.sectionOptions?.noStyles">
                              <div class="jsf-layout-wizard-center-item-scroll-container">
                                  <ng-container *ngIf="!isInsideNativeFrame(); else desktopLayoutContent">
                                      <overlay-scrollbars [options]="scrollOptions">
                                          <ng-container *ngTemplateOutlet="desktopLayoutContent"></ng-container>
                                      </overlay-scrollbars>
                                  </ng-container>

                                  <ng-template #desktopLayoutContent>
                                      <ng-container *ngFor="let item of section.items">
                                          <jsf-layout-router *ngIf="item.visible"
                                                             [layoutBuilder]="item"
                                                             [developerTools]="developerTools"
                                                             [ngClass]="getLayoutItemClass(item)"
                                                             [ngStyle]="getLayoutItemStyle(item)">
                                          </jsf-layout-router>
                                      </ng-container>
                                  </ng-template>

                              </div>
                          </div>
                      </ng-container>
                  </ng-container>

                  <!-- Mobile layout with one single scroll -->
                  <ng-template #mobileLayout>
                      <ng-container *ngIf="!isInsideNativeFrame(); else mobileLayoutContent">
                          <overlay-scrollbars [options]="scrollOptions">
                              <ng-container *ngTemplateOutlet="mobileLayoutContent"></ng-container>
                          </overlay-scrollbars>
                      </ng-container>

                      <ng-template #mobileLayoutContent>
                          <ng-container *ngFor="let section of centerSections">
                              <div class="jsf-layout-wizard-center-item"
                                   *ngIf="isSectionVisible(section)"
                                   [class.desktop-layout]="isDesktopLayoutBreakpointActive()"
                                   [class.jsf-layout-wizard-content]="section.layout.sectionType === 'content'"
                                   [class.jsf-layout-wizard-sidebar]="section.layout.sectionType === 'sidebar'"
                                   [class.jsf-layout-wizard-no-styles]="section.layout.sectionOptions?.noStyles">
                                  <div class="jsf-layout-wizard-center-item-static-container">
                                      <ng-container *ngFor="let item of section.items">
                                          <jsf-layout-router *ngIf="item.visible"
                                                             [layoutBuilder]="item"
                                                             [developerTools]="developerTools"
                                                             [ngClass]="getLayoutItemClass(item)"
                                                             [ngStyle]="getLayoutItemStyle(item)">
                                          </jsf-layout-router>
                                      </ng-container>
                                  </div>
                              </div>
                          </ng-container>
                      </ng-template>
                  </ng-template>
              </div>

              <div class="jsf-layout-wizard-bottom">
                  <ng-container *ngFor="let section of bottomSections">
                      <div class="jsf-layout-wizard-footer"
                           *ngIf="isSectionVisible(section)"
                           [class.desktop-layout]="isDesktopLayoutBreakpointActive()"
                           [class.jsf-layout-wizard-no-styles]="section.layout.sectionOptions?.noStyles">
                          <ng-container *ngFor="let item of section.items">
                              <jsf-layout-router *ngIf="item.visible"
                                                 [layoutBuilder]="item"
                                                 [developerTools]="developerTools"
                                                 [ngClass]="getLayoutItemClass(item)"
                                                 [ngStyle]="getLayoutItemStyle(item)">
                              </jsf-layout-router>
                          </ng-container>
                      </div>
                  </ng-container>
              </div>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./wizard.component.scss']
})
export class LayoutWizardComponent extends AbstractItemsLayoutComponent<JsfLayoutWizard> implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  layoutBuilder: JsfItemsLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChild('wizardElement', { read: ElementRef, static: true })
  wizardElement: ElementRef;

  public scrollOptions = {
    ...jsfDefaultScrollOptions,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    resize          : 'none',
    paddingAbsolute : true,
    sizeAutoCapable : false
  };

  private resizeObserver: ResizeObserverInterface;

  /**
   * This observable will emit whenever the steps or header templates need to be updated.
   */
  private _update: Subject<void> = new Subject<void>();

  get update$(): Observable<void> {
    return this._update.asObservable();
  }

  /**
   * Sections to display in the header.
   */
  topSections: JsfAbstractItemsLayoutBuilder<JsfLayoutWizardSection>[];
  /**
   * Sections to display in the center.
   */
  centerSections: JsfAbstractItemsLayoutBuilder<JsfLayoutWizardSection>[];
  /**
   * Sections to display in the bottom.
   */
  bottomSections: JsfAbstractItemsLayoutBuilder<JsfLayoutWizardSection>[];

  constructor(private cdRef: ChangeDetectorRef,
              private responsiveService: JsfResponsiveService,
              @Optional() @SkipSelf() protected showValidation: ShowValidationMessagesDirective) {
    super();
  }

  public stepIdsWithVisibleErrorStates: string[] = [];

  private _selectedStep: JsfWizardStep;
  get selectedStep(): JsfWizardStep {
    return this._selectedStep;
  }

  private _steps: JsfWizardStep[];
  get steps(): JsfWizardStep[] {
    return this._steps;
  }

  private _stepPropKeys: {
    [stepId: string]: string[]
  } = {};

  private _stepValidState: {
    [stepId: string]: boolean
  } = {};

  get linear(): boolean {
    return this.layout.linear;
  }

  get primary(): boolean {
    return this.layout.primary;
  }

  get initialStep(): string | { $eval: string } {
    return this.layout.initialStep;
  }

  get onStepChange(): { $eval: string } {
    return this.layout.onStepChange;
  }

  get parentValidationContextState(): boolean {
    return this.showValidation && this.showValidation.state;
  }

  public ngOnInit(): void {
    this.registerLayoutComponent();

    if (this.isEvalObject(this.layout.steps)) {
      if (this.layout.steps?.dependencies.length) {
        for (const dependency of this.layout.steps.dependencies) {
          const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
          this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status: PropStatusChangeInterface) => {
              if (status.status !== PropStatus.Pending) {
                this.updateSteps();
              }
            });
        }
      }
    }

    this.showValidation.state$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this._update.next());

    this.registerResizeListeners();

    this.updateWizardHeight();
    this.updateSections();
    this.updateSteps();
    this.subscribeToStatusChange();

    this.layoutBuilder.rootBuilder.analyticsService.track({
      name   : 'wizard:init',
      payload: {
        wizardId: this.id
      }
    });
  }

  public ngAfterViewInit(): void {
    // Select the step here to ensure all steps get registered to the wizard.
    let initialStep = this.steps[0];
    if (this.initialStep) {
      if (typeof this.initialStep === 'string') {
        initialStep = this.getStepById(this.initialStep);
      } else {
        const ctx  = this.layoutBuilder.rootBuilder.getEvalContext({
          layoutBuilder: this.layoutBuilder
        });
        const step = this.layoutBuilder.rootBuilder.runEvalWithContext(
          (this.initialStep as any).$evalTranspiled || this.initialStep.$eval, ctx);
        if (step !== null && step !== undefined && !isNaN(step)) {
          initialStep = this.getStepById(step);
        }
      }
    }

    if (this.primary) {
      this.layoutBuilder.rootBuilder.analyticsService.track({
        name   : 'step-complete',
        payload: {
          wizardId : this.id,
          stepIndex: initialStep
        }
      });
    }

    this.selectStep(initialStep);
  }


  public ngOnDestroy(): void {
    this.unregisterLayoutComponent();
    this.unregisterResizeListeners();

    super.ngOnDestroy();
  }

  private updateSections() {
    this.topSections = (this.layoutBuilder.items as JsfAbstractItemsLayoutBuilder<JsfLayoutWizardSection>[])
      .filter(x => x.type === 'wizard-section' && x.layout.sectionType === 'header');

    this.centerSections = (this.layoutBuilder.items as JsfAbstractItemsLayoutBuilder<JsfLayoutWizardSection>[])
      .filter(x => x.type === 'wizard-section' && (x.layout.sectionType === 'content' || x.layout.sectionType === 'sidebar'));

    this.bottomSections = (this.layoutBuilder.items as JsfAbstractItemsLayoutBuilder<JsfLayoutWizardSection>[])
      .filter(x => x.type === 'wizard-section' && x.layout.sectionType === 'footer');
  }

  private updateSteps() {
    if (this.isEvalObject(this.layout.steps)) {

      const ctx   = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder: this.layoutBuilder
      });
      this._steps = this.layoutBuilder.rootBuilder.runEvalWithContext(
        (this.layout.steps as any).$evalTranspiled || this.layout.steps.$eval, ctx);
    } else {
      this._steps = this.layout.steps;
    }

    // Check for valid selected step
    if (this.selectedStep && !this.steps.find(x => x.id === this.selectedStep.id)) {
      this.selectStep(this.steps[0]);
    }

    this._update.next();

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  private subscribeToStatusChange() {
    this.layoutBuilder.rootBuilder.statusChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateAllStepValidStates();
        this._update.next();
      });
  }

  nextStep(): void {
    const currentIndex = this.getStepIndex(this.selectedStep);
    this.selectStep(this.steps[Math.min(currentIndex + 1, this.steps.length - 1)]);
  }

  previousStep(): void {
    const currentIndex = this.getStepIndex(this.selectedStep);
    this.selectStep(this.steps[Math.max(currentIndex - 1, 0)]);
  }

  public isSectionVisible(section: JsfAbstractItemsLayoutBuilder<JsfLayoutWizardSection>) {
    if (!section.visible) {
      return false;
    }

    if (section?.layout?.sectionOptions?.stepIds) {
      for (const stepId of section.layout.sectionOptions.stepIds) {
        if (this.isStepSelected(this.getStepById(stepId))) {
          return true;
        }
      }

      return false;
    }
    return true;
  }

  public isDesktopLayoutBreakpointActive() {
    const breakpoint = (this.layoutBuilder.layout as any)?.breakpoints?.desktopLayout || 'sm';
    return this.responsiveService.isBreakpointMatched(breakpoint);
  }

  public getStepName(step: JsfWizardStep) {
    return this.i18n(step.title);
  }

  public getStepIndex(step: JsfWizardStep) {
    return this.steps.indexOf(this.getStepById(step.id));
  }

  public getStepById(id: string) {
    return this.steps.find(x => x.id === id);
  }

  public isStepSelected(step: JsfWizardStep) {
    return this.selectedStep && step && this.selectedStep.id === step.id;
  }

  /**
   * Checks if step is valid. This will check all of step's props for validity.
   * If you need to use the state in templates you should use getStepValidState since it uses a cached value.
   */
  public isStepValid(step: JsfWizardStep) {
    const stepPropKeys = this._stepPropKeys[step.id] || [];
    for (const key of stepPropKeys) {
      const prop = this.layoutBuilder.rootBuilder.getProp(key);
      if (!prop.legit) {
        return false;
      }
    }
    return true;
  }

  public isStepErrorStateVisible(step: JsfWizardStep) {
    return this.parentValidationContextState || this.stepIdsWithVisibleErrorStates.indexOf(step.id) > -1;
  }

  /**
   * Selects a step. Returns true if successful, false if some step was invalid.
   *
   */
  public selectStep(step: JsfWizardStep, options?: { skipUpdateErrorState?: boolean }) {
    for (const s of this.steps) {
      this._selectedStep = s;

      if (this._selectedStep.id === step.id) {
        break;
      } else {
        if (!this.isStepInValidState(s)) {
          if (!options?.skipUpdateErrorState) {
            this.markStepErrorStateAsVisible(s);
          }

          if (this.linear) {
            this._update.next();
            this.updateSelectedStepLayoutState();
            return false;
          }
        }
      }
    }

    this._selectedStep = step;

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();

    this._update.next();
    this.updateSelectedStepLayoutState();
    return true;
  }

  private updateSelectedStepLayoutState() {
    this.setLayoutState('activeStep', this._selectedStep.id);
    const newStepIndex              = this._selectedStep.analyticsStepIndex ?? this.getStepIndex(this._selectedStep);
    const highestActivatedStepIndex = this.getLayoutState('highestActivatedAnalyticsStepIndex') || 0;

    if (newStepIndex > highestActivatedStepIndex) {
      this.setLayoutState('highestActivatedAnalyticsStepIndex', newStepIndex);

      if (this.primary) {
        this.layoutBuilder.rootBuilder.analyticsService.track({
          name   : 'step-complete',
          payload: {
            wizardId : this.id,
            stepIndex: newStepIndex
          }
        });
      }
    }
  }

  public markStepErrorStateAsVisible(step: JsfWizardStep) {
    if (!this.isStepErrorStateVisible(step)) {
      this.stepIdsWithVisibleErrorStates.push(step.id);
    }
  }

  /**
   * Returns cached validity state.
   */
  public isStepInValidState(step: JsfWizardStep) {
    if (this._stepValidState[step.id] === void 0) {
      this.updateStepValidState(step);
    }
    return this._stepValidState[step.id];
  }

  private updateAllStepValidStates() {
    for (const step of this.steps) {
      this.updateStepValidState(step);
    }
  }

  private updateStepValidState(step: JsfWizardStep) {
    this._stepValidState[step.id] = this.isStepValid(step);
    this._update.next();
  }

  public registerStepPropKeys(stepId: string, keys: string[]) {
    // Due to how dynamic arrays work we have to modify our keys to not include any '[]' paths, since for those we can't determine which
    // index to validate. In these cases we just take the key path up to the first array we find.
    // This is perfectly fine to do in any case, since in order to output an array in the layout we have to use some kind of array layout
    // which will already ensure the whole array is checked for validity.
    const filteredKeys = keys.map(x => x.split('[]')[0]);

    this._stepPropKeys[stepId] = this._stepPropKeys[stepId] || [];
    this._stepPropKeys[stepId].push(...filteredKeys);
    this._stepPropKeys[stepId] = uniq(this._stepPropKeys[stepId]);
    // console.log(`Registered keys for step "${ stepId }"`, keys, `Filtered:`, filteredKeys);

    this.updateStepValidState(this.getStepById(stepId));
  }

  private registerResizeListeners() {
    window.addEventListener('resize', () => {
      this.updateWizardHeight();
    });

    // Find element
    if (this.getWizardSizeObserverElement()) {
      this.resizeObserver = new ResizeObserver((entries) => {
        if (entries.length !== 1) {
          throw new Error(`Invalid number of ResizeObserver entries.`);
        }

        this.updateWizardHeight();
      });

      this.resizeObserver.observe(this.getWizardSizeObserverElement());
    }
  }

  private unregisterResizeListeners() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private getWizardSizeObserverElement(): HTMLElement {
    return document.querySelector('.jsf-wizard-size-observer');
  }

  private updateWizardHeight() {
    if (this.wizardElement && !this.isInsideNativeFrame()) {
      const sizeObserverElement = this.getWizardSizeObserverElement();
      if (sizeObserverElement) {
        const cs = getComputedStyle(sizeObserverElement);

        const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

        const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

        // Element width and height minus padding and border
        const elementWidth  = sizeObserverElement.offsetWidth - paddingX - borderX;
        const elementHeight = sizeObserverElement.offsetHeight - paddingY - borderY;

        (this.wizardElement.nativeElement as HTMLElement).style.width  = `${ elementWidth }px`;
        (this.wizardElement.nativeElement as HTMLElement).style.height = `${ elementHeight }px`;
      } else {
        const vh                                                       = window.innerHeight;
        (this.wizardElement.nativeElement as HTMLElement).style.height = `${ vh }px`;
      }
    }
  }

  public isInsideNativeFrame() {
    return this.layoutBuilder.rootBuilder.hasMode(LayoutMode.Embedded);
  }

  private isEvalObject(x: any): x is { $eval: string, dependencies?: string[] } {
    return typeof x === 'object' && '$eval' in x;
  }

}
