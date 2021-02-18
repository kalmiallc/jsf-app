import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  JsfLayoutButton,
  JsfLayoutButtonPreferences,
  JsfSpecialLayoutBuilder,
  PropStatus,
  PropStatusChangeInterface
}                                                                               from '@kalmia/jsf-common-es2015';
import { AbstractSpecialLayoutComponent }                                       from '../../../abstract/special-layout.component';
import { JsfScrollService }                                                     from '../../../services/scroll.service';
import { BuilderDeveloperToolsInterface }                                       from '../../../builder-developer-tools.interface';
import { takeUntil }                                                            from 'rxjs/operators';

@Component({
  selector       : 'jsf-layout-button',
  template       : `
      <jsf-button [htmlClass]="htmlClass"
                  [id]="id"
                  [disabled]="disabled"
                  (click)="dispatchClickEvents($event)"
                  [variant]="themePreferences.variant"
                  [color]="themePreferences.color"
                  [size]="themePreferences.size"
                  [disableRipple]="themePreferences.disableRipple"
                  [icon]="icon"
                  [title]="title">
      </jsf-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LayoutButtonComponent extends AbstractSpecialLayoutComponent<JsfLayoutButton> implements OnInit {

  private _disabled = false;

  @Input()
  layoutBuilder: JsfSpecialLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  constructor(private scrollService: JsfScrollService,
              private cdRef: ChangeDetectorRef) {
    super();
  }

  get title(): string {
    const templateData = this.getTitleTemplateData();

    if (templateData) {
      const template = this.translationServer.getTemplate(this.i18n(this.layout.title));
      return template(templateData);
    }

    return this.i18n(this.layout.title);
  }

  get titleDependencies(): string[] {
    return this.layout.titleTemplateData ? this.layout.titleTemplateData.dependencies || [] : [];
  }


  get icon(): string {
    return this.layout.icon;
  }

  get isSubmit(): boolean {
    return this.layout.submit || false;
  }

  get type(): string {
    return 'button';
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get themePreferences(): JsfLayoutButtonPreferences {
    return {
      /* Defaults */
      color        : 'none',
      variant      : 'basic',
      size         : 'normal',
      disableRipple: false,

      /* Global overrides */
      ...(this.globalThemePreferences ? this.globalThemePreferences.button : {}),

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutButtonPreferences;
  }

  ngOnInit(): void {
    this.updateDisabledState();
    this.cdRef.detectChanges();

    if (this.layout.disabled && typeof this.layout.disabled === 'object') {
      for (const dependency of this.layout.disabled.dependencies || []) {
        const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
        this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((status: PropStatusChangeInterface) => {
            if (status.status !== PropStatus.Pending) {
              this.updateDisabledState();
              this.cdRef.detectChanges();
            }
          });
      }
    }

    if (this.layout.titleTemplateData) {
      if (this.titleDependencies.length) {
        for (const dependency of this.titleDependencies) {
          const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
          this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status: PropStatusChangeInterface) => {
              if (status.status !== PropStatus.Pending) {
                this.cdRef.detectChanges();
              }
            });
        }
      } else {
        if (this.layoutBuilder.rootBuilder.warnings) {
          console.warn(`Layout 'button' [${ this.layoutBuilder.id }] uses titleTemplateData but has not listed any dependencies.`,
            `The component will be updated on every form value change which may decrease performance.`);
        }
        this.layoutBuilder.rootBuilder.propBuilder.statusChange
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((status: PropStatus) => {
            if (status !== PropStatus.Pending) {
              this.cdRef.detectChanges();
            }
          });
      }
    }
  }

  getTitleTemplateData(): any {
    if (this.layout.titleTemplateData) {

      const ctx = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder: this.layoutBuilder
      });
      return this.layoutBuilder.rootBuilder.runEvalWithContext(
        (this.layout.titleTemplateData as any).$evalTranspiled || this.layout.titleTemplateData.$eval, ctx);

    }
  }

  updateDisabledState() {
    if (this.layout.disabled) {
      let disabled = this.layout.disabled;
      if (typeof disabled === 'object' && '$eval' in disabled) {
        const ctx = this.layoutBuilder.rootBuilder.getEvalContext({
          layoutBuilder: this.layoutBuilder as any
        });
        disabled  = this.layoutBuilder.rootBuilder.runEvalWithContext((disabled as any).$evalTranspiled || disabled.$eval, ctx);
      }

      return this._disabled = !!disabled;
    }

    this._disabled = false;
  }

  async dispatchClickEvents(event: any) {
    if (this.disabled) {
      return;
    }

    this.scrollToTop();

    if (this.isSubmit) {
      await this.layoutBuilder.rootBuilder.runOnSubmitHook();
    }

    await this.handleLayoutClick(event);
  }

  scrollToTop() {
    if (this.layout.scrollToTop) {
      this.scrollService.scrollToTop();
    }
  }

  isSizeNormal = () => this.themePreferences.size === 'normal';
  isSizeSmall  = () => this.themePreferences.size === 'small';
  isSizeLarge  = () => this.themePreferences.size === 'large';

}
