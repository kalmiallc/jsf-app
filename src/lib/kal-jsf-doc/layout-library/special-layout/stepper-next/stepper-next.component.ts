import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutButtonComponent }              from '../button/button.component';

@Component({
  selector       : 'jsf-layout-stepper-next',
  template       : `
    <ng-container [ngSwitch]="themePreferences.variant">
      <button *ngSwitchCase="'basic'"
              type="button"
              class="jsf-layout-stepper-next jsf-animatable"
              [class.jsf-layout-stepper-next-normal]="isSizeNormal()"
              [class.jsf-layout-stepper-next-small]="isSizeSmall()"
              [class.jsf-layout-stepper-next-large]="isSizeLarge()"
              [ngClass]="htmlClass"
              mat-button
              matStepperNext
              (click)="dispatchClickEvents($event)"
              [color]="themePreferences.color"
              [disableRipple]="themePreferences.disableRipple">
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
        <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
      </button>
      <button *ngSwitchCase="'raised'"
              type="button"
              class="jsf-layout-stepper-next jsf-animatable"
              [class.jsf-layout-stepper-next-normal]="isSizeNormal()"
              [class.jsf-layout-stepper-next-small]="isSizeSmall()"
              [class.jsf-layout-stepper-next-large]="isSizeLarge()"
              [ngClass]="htmlClass"
              mat-raised-button
              matStepperNext
              (click)="dispatchClickEvents($event)"
              [color]="themePreferences.color !== 'none' && themePreferences.color"
              [disableRipple]="themePreferences.disableRipple">
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
        <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
      </button>
      <button *ngSwitchCase="'stroked'"
              type="button"
              class="jsf-layout-stepper-next jsf-animatable"
              [class.jsf-layout-stepper-next-normal]="isSizeNormal()"
              [class.jsf-layout-stepper-next-small]="isSizeSmall()"
              [class.jsf-layout-stepper-next-large]="isSizeLarge()"
              [ngClass]="htmlClass"
              mat-stroked-button
              matStepperNext
              (click)="dispatchClickEvents($event)"
              [color]="themePreferences.color !== 'none' && themePreferences.color"
              [disableRipple]="themePreferences.disableRipple">
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
        <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
      </button>
      <button *ngSwitchCase="'flat'"
              type="button"
              class="jsf-layout-stepper-next jsf-animatable"
              [class.jsf-layout-stepper-next-normal]="isSizeNormal()"
              [class.jsf-layout-stepper-next-small]="isSizeSmall()"
              [class.jsf-layout-stepper-next-large]="isSizeLarge()"
              [ngClass]="htmlClass"
              mat-flat-button
              matStepperNext
              (click)="dispatchClickEvents($event)"
              [color]="themePreferences.color !== 'none' && themePreferences.color"
              [disableRipple]="themePreferences.disableRipple">
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
        <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
      </button>
      <button *ngSwitchCase="'icon'"
              type="button"
              class="jsf-layout-stepper-next jsf-animatable"
              [class.jsf-layout-stepper-next-normal]="isSizeNormal()"
              [class.jsf-layout-stepper-next-small]="isSizeSmall()"
              [class.jsf-layout-stepper-next-large]="isSizeLarge()"
              [ngClass]="htmlClass"
              mat-icon-button
              (click)="dispatchClickEvents($event)"
              [color]="themePreferences.color !== 'none' && themePreferences.color"
              [disableRipple]="themePreferences.disableRipple">
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
        <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
      </button>
      <button *ngSwitchCase="'fab'"
              type="button"
              class="jsf-layout-stepper-next jsf-animatable"
              [class.jsf-layout-stepper-next-normal]="isSizeNormal()"
              [class.jsf-layout-stepper-next-small]="isSizeSmall()"
              [class.jsf-layout-stepper-next-large]="isSizeLarge()"
              [ngClass]="htmlClass"
              mat-fab
              matStepperNext
              (click)="dispatchClickEvents($event)"
              [color]="themePreferences.color !== 'none' && themePreferences.color"
              [disableRipple]="themePreferences.disableRipple">
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
        <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
      </button>
      <button *ngSwitchCase="'mini-fab'"
              type="button"
              class="jsf-layout-stepper-next jsf-animatable"
              [class.jsf-layout-stepper-next-normal]="isSizeNormal()"
              [class.jsf-layout-stepper-next-small]="isSizeSmall()"
              [class.jsf-layout-stepper-next-large]="isSizeLarge()"
              [ngClass]="htmlClass"
              mat-mini-fab
              matStepperNext
              (click)="dispatchClickEvents($event)"
              [color]="themePreferences.color !== 'none' && themePreferences.color"
              [disableRipple]="themePreferences.disableRipple">
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
        <span class="jsf-button-title" *ngIf="title">{{ title }}</span>
      </button>
      <pre *ngSwitchDefault>Unknown button variant {{ layoutBuilder.layout | json }}</pre>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LayoutStepperNextComponent extends LayoutButtonComponent {
}
