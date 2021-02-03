import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Optional } from '@angular/core';
import { AbstractPropLayoutComponent }                                                    from '../abstract/prop-layout.component';
import {
  JsfLayoutPropStringPreferences,
  JsfPropBuilderDate,
  JsfPropLayoutBuilder,
  JsfProviderExecutorStatus
}                                                                                         from '@kalmia/jsf-common-es2015';
import { ShowValidationMessagesDirective }                                                from '../directives/show-validation-messages.directive';
import { takeUntil }                                                                      from 'rxjs/operators';
import { BuilderDeveloperToolsInterface }                                                 from '../builder-developer-tools.interface';

@Component({
  selector       : 'jsf-prop-date',
  template       : `
    <jsf-input [type]="'date'"
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
               [minimum]="prop.minimum"
               [maximum]="prop.maximum"
               [layoutBuilder]="layoutBuilder"
               [errorStateMatcher]="errorStateMatcher">
    </jsf-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
    `:host ::ng-deep .mat-form-field, .mat-input-element {
          cursor: pointer;
    }`
  ]
})
export class PropDateComponent extends AbstractPropLayoutComponent<JsfPropBuilderDate> implements OnInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderDate>;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

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

  get themePreferences(): JsfLayoutPropStringPreferences {
    return {
      /* Defaults */
      appearance : 'legacy',
      variant    : 'standard',
      color      : 'primary',
      clearable  : false,
      prefixIcon : '',
      prefixLabel: '',
      suffixIcon : '',
      suffixLabel: '',

      /* Global overrides */
      ...(this.globalThemePreferences ? this.globalThemePreferences.date : {}),

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutPropStringPreferences;
  }

  isVariantStandard = () => this.themePreferences.variant === 'standard';
  isVariantSmall    = () => this.themePreferences.variant === 'small';

}
