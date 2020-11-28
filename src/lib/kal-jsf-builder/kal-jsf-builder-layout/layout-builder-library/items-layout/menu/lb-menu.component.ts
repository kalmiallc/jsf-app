import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutButtonPreferences, JsfLayoutEditor }                            from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';
import { set }                                                                    from 'lodash';

@Component({
  selector       : 'jsf-lb-menu',
  template       : `
      <ng-container [ngSwitch]="themePreferences.variant">
          <button *ngSwitchCase="'basic'"
                  type="button"
                  class="jsf-lb-menu jsf-layout-button jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-button
                  [color]="themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
              <mat-icon class="mr-n2">{{ dropZoneVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
          </button>
          <button *ngSwitchCase="'raised'"
                  type="button"
                  class="jsf-lb-menu jsf-layout-button jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-raised-button
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
              <mat-icon class="mr-n2">{{ dropZoneVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
          </button>
          <button *ngSwitchCase="'stroked'"
                  type="button"
                  class="jsf-lb-menu jsf-layout-button jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-stroked-button
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
              <mat-icon class="mr-n2">{{ dropZoneVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
          </button>
          <button *ngSwitchCase="'flat'"
                  type="button"
                  class="jsf-lb-menu jsf-layout-button jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-flat-button
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
              <mat-icon class="mr-n2">{{ dropZoneVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
          </button>
          <button *ngSwitchCase="'icon'"
                  type="button"
                  class="jsf-lb-menu jsf-layout-button jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-icon-button
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
              <mat-icon class="mr-n2">{{ dropZoneVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
          </button>
          <button *ngSwitchCase="'fab'"
                  type="button"
                  class="jsf-lb-menu jsf-layout-button jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-fab
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
              <mat-icon class="mr-n2">{{ dropZoneVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
          </button>
          <button *ngSwitchCase="'mini-fab'"
                  type="button"
                  class="jsf-lb-menu jsf-layout-button jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-mini-fab
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
              <mat-icon class="mr-n2">{{ dropZoneVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
          </button>
      </ng-container>

      <ng-template #actionBarTemplate>
          <jsf-kal-jsf-builder-action-bar-button [icon]="dropZoneVisible ? 'unfold_less' : 'unfold_more'" (click)="dropZoneVisible = !dropZoneVisible; detectChanges()"></jsf-kal-jsf-builder-action-bar-button>
          <jsf-kal-jsf-builder-action-bar-button icon="texture" [matMenuTriggerFor]="buttonMenu"></jsf-kal-jsf-builder-action-bar-button>
      </ng-template>

      <div class="jsf-lb-menu-drop-zone" *ngIf="dropZoneVisible">
          <jsf-layout-builder-items-router
                  *ngIf="layoutEditor.supportsItems"
                  [parent]="layoutEditor"
                  [items]="layoutEditor.items">
          </jsf-layout-builder-items-router>
      </div>

      <mat-menu #buttonMenu="matMenu">
          <button mat-menu-item (click)="setVariant('basic')">Basic</button>
          <button mat-menu-item (click)="setVariant('raised')">Raised</button>
          <button mat-menu-item (click)="setVariant('stroked')">Stroked</button>
          <button mat-menu-item (click)="setVariant('flat')">Flat</button>
          <button mat-menu-item (click)="setVariant('icon')">Icon</button>
          <button mat-menu-item (click)="setVariant('fab')">Fab</button>
          <button mat-menu-item (click)="setVariant('mini-fab')">Mini fab</button>
      </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbMenuComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  public dropZoneVisible = false;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

  get icon(): string {
    return this.layout.icon;
  }

  get title(): string {
    return this.layout.title;
  }

  setVariant(variant: string) {
    set(this.layoutEditor.mutableDefinition, 'preferences.variant', variant);
    this.emitDefinitionChange();
    this.detectChanges();
  }

  get themePreferences(): JsfLayoutButtonPreferences {
    return {
      /* Defaults */
      color        : 'primary',
      variant      : 'basic',
      size         : 'normal',
      disableRipple: false,

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutButtonPreferences;
  }

  isSizeNormal = () => this.themePreferences.size === 'normal';
  isSizeSmall  = () => this.themePreferences.size === 'small';
  isSizeLarge  = () => this.themePreferences.size === 'large';

}
