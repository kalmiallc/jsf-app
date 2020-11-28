import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  ViewChild,
  ViewChildren
}                                          from '@angular/core';
import { AbstractPropLayoutComponent }     from '../abstract/prop-layout.component';
import {
  JsfAbstractLayout,
  JsfAbstractLayoutBuilder,
  JsfExpansionPanelPropLayoutBuilder,
  JsfLayoutPropExpansionPanel,
  JsfLayoutPropExpansionPanelPreferences,
  JsfPropBuilderArray,
  PropStatus,
  PropStatusChangeInterface
}                                          from '@kalmia/jsf-common-es2015';
import { ShowValidationMessagesDirective } from '../directives/show-validation-messages.directive';
import { takeUntil }                       from 'rxjs/operators';
import { BuilderDeveloperToolsInterface }  from '../builder-developer-tools.interface';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector       : 'jsf-prop-expansion-panel',
  template       : `
      <div class="jsf-prop jsf-prop-expansion-panel jsf-animatable" [ngClass]="htmlClass">
          <mat-accordion [multi]="multi">
              <mat-expansion-panel *ngFor="let layoutBuilders of items; let first = first; let last = last; let i = index"
                                   [class.expansion-panel-invalid]="isExpansionPanelErrorStateVisible(layoutBuilders) && !isExpansionPanelDisabled(layoutBuilders)"
                                   #jsfShowValidationMessages="jsfShowValidationMessages"
                                   [jsfShowValidationMessages]="isExpansionPanelErrorStateVisible(layoutBuilders)"
                                   [disabled]="isExpansionPanelDisabled(layoutBuilders)"
                                   (opened)="panelOpened(i)"
                                   (closed)="panelClosed(i)"
                                   (afterCollapse)="panelCollapsed(i)"
                                   (jsfArrayItemRemove)="remove(i)">
                  <mat-expansion-panel-header>
                      <mat-panel-title *ngIf="getHeaderLayoutBuilder(layoutBuilders)">
                          <jsf-layout-router [layoutBuilder]="getHeaderLayoutBuilder(layoutBuilders)"
                                             [developerTools]="developerTools">
                          </jsf-layout-router>
                      </mat-panel-title>
                  </mat-expansion-panel-header>

                  <div class="expansion-panel-content" *ngIf="isPanelContentVisible(i)">
                      <jsf-layout-router [layoutBuilder]="getContentLayoutBuilder(layoutBuilders)"
                                         [developerTools]="developerTools">
                      </jsf-layout-router>
                  </div>

                  <mat-action-row *ngIf="!multi && !(first && last)">
                      <button type="button" mat-icon-button color="primary" (click)="prevStep()" *ngIf="!first">
                          <mat-icon>navigate_before</mat-icon>
                      </button>
                      <button type="button" mat-icon-button color="primary" (click)="nextStep()" *ngIf="!last">
                          <mat-icon>navigate_next</mat-icon>
                      </button>
                  </mat-action-row>
              </mat-expansion-panel>
          </mat-accordion>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class PropExpansionPanelComponent extends AbstractPropLayoutComponent<JsfPropBuilderArray> implements OnInit, OnDestroy {
  private expansionPanelPropsWithVisibleErrorState = [];

  @Input()
  layoutBuilder: JsfExpansionPanelPropLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChild(MatAccordion)
  accordion: MatAccordion;

  @ViewChildren(MatExpansionPanel)
  expansionPanels: QueryList<MatExpansionPanel>;

  private _panelOnIndexOpen = {};

  private _step;
  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
    this.detectChanges();
  }

  private _items: JsfAbstractLayoutBuilder<JsfAbstractLayout>[][];
  get items() {
    return this._items;
  }

  get multi() {
    return (this.layout as JsfLayoutPropExpansionPanel).multi;
  }

  get forceValidationMessagesVisible(): boolean {
    return this.showValidation && this.showValidation.state;
  }

  constructor(protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective) {
    super(cdRef, showValidation);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.registerLayoutComponent();
    this.setupItems();
    this.updateItems();

    this.step = this.themePreferences.startCollapsed ? null : 0;

    this.layoutBuilder.propBuilder.onItemAdd
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(x => {
        this.updateItems();
        this.step = x.index; // Show the newly-added item.
      });

    this.layoutBuilder.propBuilder.onItemRemove
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(x => {
        this.updateItems();
        const totalItems = this.value.length; // This here will already contain the new amount of items.
        if (x.index >= totalItems) {
          this.step = totalItems - 1;
        }
      });

    this.layoutBuilder.propBuilder.onItemsSet
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(x => {
        this.updateItems();
        this.detectChanges();
      });

    this.showValidation.state$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(x => {
        this.detectChanges();
      });

    this.expansionPanels.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(x => {
        this.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this.unregisterLayoutComponent();
  }

  private setupItems() {
    const filter = (this.layout as JsfLayoutPropExpansionPanel).filter;
    if (filter) {
      // Eval
      if (filter.$eval) {
        if (filter.dependencies.length) {
          for (const dependency of filter.dependencies) {
            const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
            this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((status: PropStatusChangeInterface) => {
                if (status.status !== PropStatus.Pending) {
                  this.updateItems();
                }
              });
          }
        }
      }
    }
  }

  private updateItems() {
    const filter = (this.layout as JsfLayoutPropExpansionPanel).filter;
    if (filter) {
      // Eval
      if (filter.$eval) {
        const ctx   = this.layoutBuilder.rootBuilder.getEvalContext({
          layoutBuilder     : this.layoutBuilder,
          extraContextParams: {
            $value: this.propBuilder.getJsonValue()
          }
        });
        let indexes = this.layoutBuilder.rootBuilder.runEvalWithContext(
          (filter as any).$evalTranspiled || filter.$eval, ctx);

        if (!Array.isArray(indexes)) {
          indexes = [];
        }

        this._items = this.layoutBuilder.items.filter((value, idx) => indexes.indexOf(idx) > -1);
      }
    } else {
      this._items = this.layoutBuilder.items;
    }

    if (this.themePreferences.startCollapsed) {
      this.step = null;
    }

    this.cdRef.detectChanges();
  }

  panelOpened(index: number) {
    this.step = index;
    this.setLayoutState('activePanelIndex', index);
    this._panelOnIndexOpen[index] = true;
    this.runOnPanelStateChangeEvent();
  }

  panelClosed(index: number) {
    this.setExpansionPanelErrorStateVisible(index);
    if (this.getLayoutState('activePanelIndex') === index) {
      this.setLayoutState('activePanelIndex', void 0);
    }
    this.runOnPanelStateChangeEvent();
  }

  panelCollapsed(index: number) {
    this._panelOnIndexOpen[index] = false;
  }

  isPanelContentVisible(index: number) {
    return !!this._panelOnIndexOpen[index] || this.step === index;
  }

  private runOnPanelStateChangeEvent() {
    if ((this.layout as JsfLayoutPropExpansionPanel).onPanelStateChange) {
      const ctx = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder     : this.layoutBuilder,
        extraContextParams: {
          $expandedPanels: this.expansionPanels.toArray().map((x, idx) => ({ idx, expanded: x.expanded })).filter(x => x.expanded).map(x => x.idx)
        }
      });
      return this.layoutBuilder.rootBuilder.runEvalWithContext(
        ((this.layout as JsfLayoutPropExpansionPanel).onPanelStateChange as any).$evalTranspiled || (this.layout as JsfLayoutPropExpansionPanel).onPanelStateChange.$eval, ctx);
    }
  }

  protected detectChanges(): void {
    if (this.expansionPanels) {
      const panelsArray = this.expansionPanels.toArray();
      if (panelsArray[this.step]) {
        panelsArray[this.step].open();
      }
    }
    super.detectChanges();
  }

  setExpansionPanelErrorStateVisible(stepIndex: number) {
    const header    = this.getHeaderLayoutBuilder(this.items[stepIndex]);
    const arrayItem = header.getPropItem(this.propBuilder.abstractPath);

    if (this.expansionPanelPropsWithVisibleErrorState.indexOf(arrayItem) === -1) {
      this.expansionPanelPropsWithVisibleErrorState.push(arrayItem);
    }

    this.cdRef.detectChanges();
  }

  nextStep() {
    let newStep = this.step;

    while (true) {
      newStep++;

      if (newStep > this.items.length - 1) {
        break;
      }

      const header    = this.getHeaderLayoutBuilder(this.items[newStep]);
      const arrayItem = header.getPropItem(this.propBuilder.abstractPath);

      if (!arrayItem.disabled) {
        this.step = newStep;
        break;
      }
    }
  }

  prevStep() {
    let newStep = this.step;

    while (true) {
      newStep--;

      if (newStep < 0) {
        break;
      }

      const header    = this.getHeaderLayoutBuilder(this.items[newStep]);
      const arrayItem = header.getPropItem(this.propBuilder.abstractPath);

      if (!arrayItem.disabled) {
        this.step = newStep;
        break;
      }
    }
  }

  getHeaderLayoutBuilder(layoutBuilders: JsfAbstractLayoutBuilder<JsfAbstractLayout>[]) {
    return layoutBuilders.find(x => x.type === 'expansion-panel-header');
  }

  getContentLayoutBuilder(layoutBuilders: JsfAbstractLayoutBuilder<JsfAbstractLayout>[]) {
    return layoutBuilders.find(x => x.type === 'expansion-panel-content');
  }

  isExpansionPanelErrorStateVisible(layoutBuilders: JsfAbstractLayoutBuilder<JsfAbstractLayout>[]) {
    const header    = this.getHeaderLayoutBuilder(layoutBuilders);
    const arrayItem = header.getPropItem(this.propBuilder.abstractPath);

    return !arrayItem.legit &&
      (this.forceValidationMessagesVisible || this.expansionPanelPropsWithVisibleErrorState.indexOf(arrayItem) > -1);
  }

  isExpansionPanelDisabled(layoutBuilders: JsfAbstractLayoutBuilder<JsfAbstractLayout>[]) {
    const header    = this.getHeaderLayoutBuilder(layoutBuilders);
    const arrayItem = header.getPropItem(this.propBuilder.abstractPath);

    return arrayItem.disabled;
  }

  async remove(itemIndex: number) {
    return this.layoutBuilder.propBuilder.removeAt(itemIndex);
  }

  get themePreferences(): JsfLayoutPropExpansionPanelPreferences {
    return {
      /* Defaults */
      startCollapsed: false,

      /* Global overrides */
      ...(this.globalThemePreferences ? this.globalThemePreferences.expansionPanel : {}),

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutPropExpansionPanelPreferences;
  }
}
