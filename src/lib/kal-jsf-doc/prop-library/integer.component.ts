import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { AbstractPropLayoutComponent }                                                               from '../abstract/prop-layout.component';
import {
  JsfLayoutPropIntegerPreferences,
  JsfPropBuilderInteger,
  JsfPropLayoutBuilder,
  JsfProviderExecutorStatus
}                                                                                                    from '@kalmia/jsf-common-es2015';
import { ShowValidationMessagesDirective }                                                           from '../directives/show-validation-messages.directive';
import { MatInput } from '@angular/material/input';
import { takeUntil }                                                                                 from 'rxjs/operators';
import { BuilderDeveloperToolsInterface }                                                            from '../builder-developer-tools.interface';

@Component({
  selector       : 'jsf-prop-integer',
  template       : `
    <jsf-input [type]="'integer'"
               [required]="prop?.required"
               [disabled]="disabled"
               [id]="id"
               [name]="propBuilder.id"
               [readonly]="prop.readonly || prop.const ? 'readonly' : null"
               [title]="i18n(prop?.title || '')"
               [description]="i18n(prop?.description || '')"
               [variant]="themePreferences.variant"
               [notitle]="layout?.notitle"
               [placeholder]="i18n(layout?.placeholder || '')"
               [htmlClass]="htmlClass"
               [color]="themePreferences.color"
               [appearance]="themePreferences.appearance"
               (click)="handleLayoutClick($event)"
               [(ngModel)]="value"
               [prefixIcon]="themePreferences.prefixIcon"
               [prefixLabel]="themePreferences.prefixLabel"
               [suffixIcon]="themePreferences.suffixIcon"
               [suffixLabel]="themePreferences.suffixLabel"
               [clearable]="themePreferences.clearable"
               [step]="themePreferences.step"
               [minimum]="prop.minimum"
               [maximum]="prop.maximum"
               [stepperButtons]="themePreferences.stepperButtons"
               [layoutBuilder]="layoutBuilder"
               [errorStateMatcher]="errorStateMatcher">
    </jsf-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class PropIntegerComponent extends AbstractPropLayoutComponent<JsfPropBuilderInteger> implements OnInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderInteger>;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChild(MatInput, { static: true })
  matInputControl: MatInput;

  constructor(protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective) {
    super(cdRef, showValidation);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.propBuilder.hasProvider) {
      this.propBuilder.providerExecutor.statusChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.detectChanges();
        });
    }
  }

  get disabled(): boolean {
    if (this.propBuilder.hasProvider && this.propBuilder.providerExecutor.status === JsfProviderExecutorStatus.Pending) {
      return true;
    }
    return this.propBuilder.disabled;
  }

  increment() {
    let x = (this.propBuilder.getValue() || 0) + this.themePreferences.step;
    if (this.prop.maximum !== undefined) {
      x = Math.min(x, this.prop.maximum);
    }
    this.value = x;
    this.markMaterialControlAsDirty();
  }

  decrement() {
    let x = (this.propBuilder.getValue() || 0) - this.themePreferences.step;
    if (this.prop.minimum !== undefined) {
      x = Math.max(x, this.prop.minimum);
    }
    this.value = x;
    this.markMaterialControlAsDirty();
  }

  private markMaterialControlAsDirty() {
    if (this.matInputControl) {
      const ngControl = this.matInputControl.ngControl;
      if (ngControl && ngControl.control) {
        ngControl.control.markAsDirty();
      }
    }
  }

  get themePreferences(): JsfLayoutPropIntegerPreferences {
    return {
      /* Defaults */
      appearance    : 'legacy',
      variant       : 'standard',
      color         : 'primary',
      clearable     : false,
      prefixIcon    : '',
      prefixLabel   : '',
      suffixIcon    : '',
      suffixLabel   : '',
      stepperButtons: false,
      step          : 1,

      /* Global overrides */
      ...(this.globalThemePreferences ? this.globalThemePreferences.integer : {}),

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutPropIntegerPreferences;
  }

  isVariantStandard = () => this.themePreferences.variant === 'standard';
  isVariantSmall    = () => this.themePreferences.variant === 'small';

}
