import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutButtonPreferences, JsfLayoutEditor }                            from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-array-item-add',
  template       : `
      <ng-container [ngSwitch]="themePreferences.variant">
          <button *ngSwitchCase="'basic'"
                  type="button"
                  class="jsf-lb-array-item-add jsf-layout-array-item-add jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-button
                  [color]="themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
          </button>
          <button *ngSwitchCase="'raised'"
                  type="button"
                  class="jsf-lb-array-item-add jsf-layout-array-item-add jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-raised-button
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
          </button>
          <button *ngSwitchCase="'stroked'"
                  type="button"
                  class="jsf-lb-array-item-add jsf-layout-array-item-add jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-stroked-button
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
          </button>
          <button *ngSwitchCase="'flat'"
                  type="button"
                  class="jsf-lb-array-item-add jsf-layout-array-item-add jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-flat-button
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
          </button>
          <button *ngSwitchCase="'icon'"
                  type="button"
                  class="jsf-lb-array-item-add jsf-layout-array-item-add jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-icon-button
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
          </button>
          <button *ngSwitchCase="'fab'"
                  type="button"
                  class="jsf-lb-array-item-add jsf-layout-array-item-add jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-fab
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
          </button>
          <button *ngSwitchCase="'mini-fab'"
                  type="button"
                  class="jsf-lb-array-item-add jsf-layout-array-item-add jsf-animatable"
                  [class.jsf-layout-button-normal]="isSizeNormal()"
                  [class.jsf-layout-button-small]="isSizeSmall()"
                  [class.jsf-layout-button-large]="isSizeLarge()"
                  [ngClass]="getLayoutEditorClass()"
                  mat-mini-fab
                  [color]="themePreferences.color !== 'none' && themePreferences.color">
              <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
              <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
          </button>
      </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbArrayItemAddComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  get icon(): string {
    return this.layout.icon;
  }

  get title(): string {
    return this.layout.title;
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

  get themePreferences(): JsfLayoutButtonPreferences {
    return {
      /* Defaults */
      color        : 'none',
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
