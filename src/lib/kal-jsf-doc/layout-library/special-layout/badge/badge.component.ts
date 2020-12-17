import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit }           from '@angular/core';
import { JsfLayoutBadge, JsfSpecialLayoutBuilder, PropStatus, PropStatusChangeInterface } from '@kalmia/jsf-common-es2015';
import { AbstractSpecialLayoutComponent }                                                 from '../../../abstract/special-layout.component';
import { BuilderDeveloperToolsInterface }                                                 from '../../../builder-developer-tools.interface';
import { takeUntil }                                                                      from 'rxjs/operators';
import Color                                                                              from 'color';

@Component({
  selector       : 'jsf-layout-badge',
  template       : `
      <jsf-badge [title]="title"
                 [htmlClass]="htmlClass"
                 [color]="color"
                 [backgroundColor]="backgroundColor">
      </jsf-badge>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LayoutBadgeComponent extends AbstractSpecialLayoutComponent<JsfLayoutBadge> implements OnInit {

  @Input()
  layoutBuilder: JsfSpecialLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  private _color: string;
  private _backgroundColor: string;

  constructor(private cdRef: ChangeDetectorRef) {
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

  get color(): string {
    return this._color;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  get titleDependencies(): string[] {
    return this.layout.templateData ? this.layout.templateData.dependencies || [] : [];
  }

  get colorDependencies(): string[] {
    return this.isEvalObject(this.layout.color) ? this.layout.color.dependencies || [] : [];
  }

  ngOnInit(): void {
    this.getColor();

    if (this.isEvalObject(this.layout.color)) {
      if (this.colorDependencies.length) {
        for (const dependency of this.colorDependencies) {
          const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
          this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status: PropStatusChangeInterface) => {
              if (status.status !== PropStatus.Pending) {
                this.getColor();
              }
            });
        }
      } else {
        if (this.layoutBuilder.rootBuilder.warnings) {
          console.warn(`Layout 'badge' [${ this.layoutBuilder.id }] uses an eval object for 'color' but has not listed any dependencies.`,
            `The component will be updated on every form value change which may decrease performance.`);
        }
        this.layoutBuilder.rootBuilder.propBuilder.statusChange
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((status: PropStatus) => {
            if (status !== PropStatus.Pending) {
              this.getColor();
            }
          });
      }
    }

    if (this.layout.templateData) {
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
          console.warn(`Layout 'badge' [${ this.layoutBuilder.id }] uses templateData but has not listed any dependencies.`,
            `The component will be updated on every form href change which may decrease performance.`);
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
    if (this.layout.templateData) {

      const ctx = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder: this.layoutBuilder
      });
      return this.layoutBuilder.rootBuilder.runEvalWithContext(
        (this.layout.templateData as any).$evalTranspiled || this.layout.templateData.$eval, ctx);

    }
  }

  private getColor() {
    if (this.isEvalObject(this.layout.color)) {

      const ctx   = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder     : this.layoutBuilder,
        extraContextParams: {
          $color: Color
        }
      });
      const color = this.layoutBuilder.rootBuilder.runEvalWithContext(
        (this.layout.color as any).$evalTranspiled || this.layout.color.$eval, ctx);

      if (color === 'primary' || color === 'accent' || color === 'warn') {
        this._color = color;
        this._backgroundColor = color;
      } else {
        this._color           = color && Color(color).rgb().string();
        this._backgroundColor = color && Color(color).alpha(.2).rgb().string();
      }
    } else {
      if (this.layout.color === 'primary' || this.layout.color === 'accent' || this.layout.color === 'warn') {
        this._color = this.layout.color;
        this._backgroundColor = this.layout.color;
      } else {
        this._color           = this.layout.color && Color(this.layout.color).rgb().string();
        this._backgroundColor = this.layout.color && Color(this.layout.color).alpha(.2).rgb().string();
      }
    }

    this.cdRef.detectChanges();
  }

  private isEvalObject(x: any): x is { $eval: string, dependencies?: string[] } {
    return typeof x === 'object' && '$eval' in x;
  }
}
