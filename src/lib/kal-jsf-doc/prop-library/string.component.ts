import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Optional } from '@angular/core';
import { AbstractPropLayoutComponent }                                                    from '../abstract/prop-layout.component';
import {
  JsfLayoutPropStringPreferences,
  JsfPropBuilderString,
  JsfPropLayoutBuilder,
  JsfPropString,
  JsfProviderExecutorStatus
}                                                                                         from '@kalmia/jsf-common-es2015';
import { ShowValidationMessagesDirective }                                                from '../directives/show-validation-messages.directive';
import { isBoolean }                                                                      from 'lodash';
import { takeUntil }                                                                      from 'rxjs/operators';
import { BuilderDeveloperToolsInterface }                                                 from '../builder-developer-tools.interface';

@Component({
  selector       : 'jsf-prop-string',
  template       : `
      <jsf-input [type]="'string'"
                 [required]="prop?.required"
                 [disabled]="disabled"
                 [id]="id"
                 [name]="propBuilder.id"
                 [readonly]="isReadOnly"
                 [title]="i18n(prop?.title || '')"
                 [description]="i18n(prop?.description || '')"
                 [variant]="themePreferences.variant"
                 [notitle]="layout?.notitle"
                 [placeholder]="i18n(layout?.placeholder || '')"
                 [multiline]="isMultiline()"
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
                 [layoutBuilder]="layoutBuilder"
                 [errorStateMatcher]="errorStateMatcher">
      </jsf-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})

export class PropStringComponent extends AbstractPropLayoutComponent<JsfPropBuilderString> implements OnInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString>;

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

  // TODO fix me !!!
  get isReadOnly() {
    if (this.prop.readonly) {
      return this.prop.readonly;
    } else if (this.prop.readonly && this.prop.readonly.$eval) {
      return !!this.layoutBuilder.rootBuilder.runEval(this.prop.readonly.$eval);
    } else {
      return false;
    }
  }

  get themePreferences(): JsfLayoutPropStringPreferences {
    return {
      /* Defaults */
      appearance : 'legacy',
      color      : 'primary',
      variant    : 'standard',
      clearable  : false,
      prefixIcon : '',
      prefixLabel: '',
      suffixIcon : '',
      suffixLabel: '',

      /* Global overrides */
      ...(this.globalThemePreferences ? this.globalThemePreferences.string : {}),

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutPropStringPreferences;
  }

  isVariantStandard = () => this.themePreferences.variant === 'standard';
  isVariantSmall    = () => this.themePreferences.variant === 'small';
  isMultiline       = () => this.prop.multiline;

}
