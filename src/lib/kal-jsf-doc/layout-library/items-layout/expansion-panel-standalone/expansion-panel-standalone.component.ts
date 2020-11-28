import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractItemsLayoutComponent }                     from '../../../abstract/items-layout.component';
import {
  JsfItemsLayoutBuilder,
  JsfLayoutExpansionPanelStandalone, JsfLayoutPropExpansionPanelStandalonePreferences
}                                                           from '@kalmia/jsf-common-es2015';
import { BuilderDeveloperToolsInterface }                   from '../../../builder-developer-tools.interface';
import { MatExpansionPanel }                                from '@angular/material/expansion';


@Component({
  selector       : 'jsf-layout-expansion-panel-standalone',
  template       : `
      <div class="jsf-layout-expansion-panel-standalone jsf-animatable"
           [id]="id"
           [ngClass]="getLayoutInnerClass()"
           (click)="handleLayoutClick($event)">
          <mat-accordion [multi]="multi">
              <mat-expansion-panel *ngFor="let panel of panels; let first = first; let last = last; let i = index;"
                                   (opened)="panelOpened(i)"
                                   [expanded]="expanded"
                                   (closed)="panelClosed(i)"
                                   (afterCollapse)="panelCollapsed(i)"
                                   #expansionPanel="matExpansionPanel">

                  <mat-expansion-panel-header class="jsf-layout-expansion-panel-standalone-header jsf-animatable">
                      <mat-panel-title>
                          <jsf-layout-router *ngFor="let item of getPanelHeaderItems(panel)"
                                             [layoutBuilder]="item"
                                             [developerTools]="developerTools"
                                             [ngClass]="getLayoutItemClass(item)"
                                             [ngStyle]="getLayoutItemStyle(item)">
                          </jsf-layout-router>
                      </mat-panel-title>
                  </mat-expansion-panel-header>

                  <div class="expansion-panel-content">
                      <ng-container *ngIf="expansionPanel.expanded">
                          <jsf-layout-router *ngFor="let item of getPanelContentItems(panel)"
                                             [layoutBuilder]="item"
                                             [developerTools]="developerTools"
                                             [ngClass]="getLayoutItemClass(item)"
                                             [ngStyle]="getLayoutItemStyle(item)">
                          </jsf-layout-router>
                      </ng-container>
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
export class LayoutExpansionPanelStandaloneComponent extends AbstractItemsLayoutComponent<JsfLayoutExpansionPanelStandalone> implements OnInit, OnDestroy {

  @Input()
  layoutBuilder: JsfItemsLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChildren(MatExpansionPanel)
  expansionPanels: QueryList<MatExpansionPanel>;

  private _panelOnIndexOpen = {};

  private _step = 0;
  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
    this.detectChanges();
  }

  get multi() {
    return (this.layout as JsfLayoutExpansionPanelStandalone).multi;
  }

  get expanded() {
    return this.multi && !this.themePreferences.startCollapsed;
  }

  get panels(): JsfItemsLayoutBuilder[] {
    return this.layoutBuilder.items.filter(x => x.type === 'expansion-panel-standalone-panel') as any;
  }

  getPanelHeaderItems(panel: JsfItemsLayoutBuilder) {
    return (panel.items.find(x => x.type === 'expansion-panel-standalone-header') as JsfItemsLayoutBuilder)?.items || [];
  }

  getPanelContentItems(panel: JsfItemsLayoutBuilder) {
    return (panel.items.find(x => x.type === 'expansion-panel-standalone-content') as JsfItemsLayoutBuilder)?.items || [];
  }

  constructor(protected cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.registerLayoutComponent();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unregisterLayoutComponent();
  }

  panelOpened(index: number) {
    this.step = index;
    this.setLayoutState('activePanelIndex', index);
    this._panelOnIndexOpen[index] = true;
  }

  panelClosed(index: number) {
    if (this.getLayoutState('activePanelIndex') === index) {
      this.setLayoutState('activePanelIndex', void 0);
    }
  }

  panelCollapsed(index: number) {
    this._panelOnIndexOpen[index] = false;
  }

  isPanelContentVisible(index: number) {
    return !!this._panelOnIndexOpen[index] || this.step === index;
  }

  protected detectChanges(): void {
    if (this.expansionPanels) {
      const panelsArray = this.expansionPanels.toArray();
      if (panelsArray[this.step]) {
        panelsArray[this.step].open();
      }
    }
    if (this.cdRef) {
      this.cdRef.detectChanges();
    }
  }


  nextStep() {
    this.step = Math.min(this.step + 1, this.layoutBuilder.items.length - 1);
  }

  prevStep() {
    this.step = Math.max(this.step - 1, 0);
  }

  get themePreferences(): JsfLayoutPropExpansionPanelStandalonePreferences {
    return {
      /* Defaults */
      startCollapsed: false,

      /* Global overrides */
      ...(this.globalThemePreferences ? this.globalThemePreferences.expansionPanel : {}),

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutPropExpansionPanelStandalonePreferences;
  }
}
