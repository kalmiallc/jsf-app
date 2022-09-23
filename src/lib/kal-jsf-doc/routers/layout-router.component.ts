import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  ViewChild,
  ViewContainerRef
}                                                                                                         from '@angular/core';
import { JsfPropLayoutBuilder, JsfUnknownLayoutBuilder, PropStatus }                                      from '@kalmia/jsf-common-es2015';
import { RouterComponent }                                                                                from './router.component';
import { Subject }                                                                                        from 'rxjs';
import { BuilderDeveloperToolsInterface }  from '../builder-developer-tools.interface';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PropRouterComponent }             from './prop-router.component';
import { LayoutDivComponent }                                                                             from '../layout-library/items-layout/div/div.component';
import { LayoutRowComponent }                                                                             from '../layout-library/items-layout/row/row.component';
import { LayoutColComponent }                                                                             from '../layout-library/items-layout/col/col.component';
import { LayoutTabSetComponent }                                                                          from '../layout-library/items-layout/tabset/tabset.component';
import { LayoutStepperComponent }                                                                         from '../layout-library/items-layout/stepper/stepper.component';
import { LayoutOrderSummaryComponent }                                                                    from '../layout-library/items-layout/order-summary/order-summary.component';
import { LayoutOrderSummaryOverlayComponent }                                                             from '../layout-library/items-layout/order-summary-overlay/order-summary-overlay.component';
import { LayoutOrderSummaryScrollContainerComponent }                                                     from '../layout-library/items-layout/order-summary-scroll-container/order-summary-scroll-container.component';
import { LayoutOrderSummaryLineItemComponent }                                                            from '../layout-library/special-layout/order-summary-line-item/order-summary-line-item.component';
import { LayoutExpansionPanelHeaderComponent }                                                            from '../layout-library/items-layout/expansion-panel-header/expansion-panel-header.component';
import { LayoutExpansionPanelContentComponent }                                                           from '../layout-library/items-layout/expansion-panel-content/expansion-panel-content.component';
import { LayoutDrawerComponent }                                                                          from '../layout-library/items-layout/drawer/drawer.component';
import { LayoutDrawerHeaderComponent }                                                                    from '../layout-library/items-layout/drawer-header/drawer-header.component';
import { LayoutDrawerContentComponent }                                                                   from '../layout-library/items-layout/drawer-content/drawer-content.component';
import { LayoutMenuComponent }                                                                            from '../layout-library/items-layout/menu/menu.component';
import { LayoutMenuItemComponent }                                                                        from '../layout-library/items-layout/menu-item/menu-item.component';
import { LayoutListComponent }                                                                            from '../layout-library/items-layout/list/list.component';
import { LayoutDialogContentComponent }                                                                   from '../layout-library/items-layout/dialog-content/dialog-content.component';
import { LayoutDialogActionsComponent }                                                                   from '../layout-library/items-layout/dialog-actions/dialog-actions.component';
import { LayoutHeadingComponent }                                                                         from '../layout-library/special-layout/heading/heading.component';
import { LayoutSpanComponent }                                                                            from '../layout-library/special-layout/span/span.component';
import { LayoutSupComponent }                                                                             from '../layout-library/special-layout/sup/sup.component';
import { LayoutSubComponent }                                                                             from '../layout-library/special-layout/sub/sub.component';
import { LayoutAnchorComponent }                                                                          from '../layout-library/special-layout/anchor/anchor.component';
import { LayoutParagraphComponent }                                                                       from '../layout-library/special-layout/paragraph/paragraph.component';
import { LayoutButtonComponent }                                                                          from '../layout-library/special-layout/button/button.component';
import { LayoutBadgeComponent }                                                                           from '../layout-library/special-layout/badge/badge.component';
import { LayoutStepperPreviousComponent }                                                                 from '../layout-library/special-layout/stepper-previous/stepper-previous.component';
import { LayoutArrayItemAddComponent }                                                                    from '../layout-library/special-layout/array-item-add/array-item-add.component';
import { LayoutArrayItemRemoveComponent }                                                                 from '../layout-library/special-layout/array-item-remove/array-item-remove.component';
import { LayoutImageComponent }                                                                           from '../layout-library/special-layout/image/image.component';
import { LayoutIconComponent }                                                                            from '../layout-library/special-layout/icon/icon.component';
import { LayoutProgressBarComponent }                                                                     from '../layout-library/special-layout/progress-bar/progress-bar.component';
import { LayoutHrComponent }                                                                              from '../layout-library/special-layout/hr/hr.component';
import { LayoutD3Component }                                                                              from '../layout-library/special-layout/d3/d3.component';
import { LayoutChartJSComponent }                                                                         from '../layout-library/special-layout/chartjs/chartjs.component';
import { LayoutCustomComponentComponent }                                                                 from '../layout-library/special-layout/custom-component/custom-component.component';
import { LayoutHtmlComponent }                                                                            from '../layout-library/special-layout/html/html.component';
import { LayoutIframeComponent }                                                                          from '../layout-library/special-layout/iframe/iframe.component';
import { LayoutProgressTrackerComponent }                                                                 from '../layout-library/items-layout/progress-tracker/progress-tracker.component';
import { LayoutProgressTrackerStepComponent }                                                             from '../layout-library/special-layout/progress-tracker-step/progress-tracker-step.component';
import { LayoutAppBreadcrumbsComponent }                                                                  from '../layout-library/special-layout/app-breadcrumbs/app-breadcrumbs.component';
import { LayoutAppPageTitleComponent }                                                                    from '../layout-library/special-layout/app-page-title/app-page-title.component';
import { LayoutPoweredByComponent }                                                                       from '../layout-library/special-layout/powered-by/powered-by.component';
import { AbstractLayoutComponent }                                                                        from '../abstract/layout.component';
import { LayoutRender2DComponent }                                                                        from '../layout-library/special-layout/render-2d/render-2d.component';
import { LayoutStepperNextComponent }                                                                     from '../layout-library/special-layout/stepper-next/stepper-next.component';
import { LayoutExpansionPanelStandaloneComponent }                                                        from '../layout-library/items-layout/expansion-panel-standalone/expansion-panel-standalone.component';
import { LayoutRender3DComponent }                                                                        from '../layout-library/special-layout/render-3d/render-3d.component';
import { LayoutWizardComponent }                                                                          from '../layout-library/items-layout/wizard/wizard.component';
import { LayoutWizardStepperHeaderComponent }                                                             from '../layout-library/special-layout/wizard-stepper-header/wizard-stepper-header.component';
import { LayoutWizardStepperContentComponent }                                                            from '../layout-library/items-layout/wizard-stepper-content/wizard-stepper-content.component';
import { LayoutFloatingDivComponent }                                                                     from '../layout-library/items-layout/floating-div/floating-div.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY, MatTooltip, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { Overlay, ScrollDispatcher }                                                                      from '@angular/cdk/overlay';
import { Platform }                                                                                       from '@angular/cdk/platform';
import { AriaDescriber, FocusMonitor }                                                                    from '@angular/cdk/a11y';
import { Directionality }                                                                                 from '@angular/cdk/bidi';
import { HAMMER_LOADER, HammerLoader }                                                                    from '@angular/platform-browser';
import { JSF_APP_CONFIG, JsfAppConfig }                                                                   from '../../common';
import { isNil }                                                                                          from 'lodash';

const componentList = {
  // Prop
  'prop': PropRouterComponent,

  // Items layouts
  'div'                           : LayoutDivComponent,
  'floating-div'                  : LayoutFloatingDivComponent,
  'row'                           : LayoutRowComponent,
  'col'                           : LayoutColComponent,
  'tabset'                        : LayoutTabSetComponent,
  'stepper'                       : LayoutStepperComponent,
  'order-summary'                 : LayoutOrderSummaryComponent,
  'order-summary-overlay'         : LayoutOrderSummaryOverlayComponent,
  'order-summary-scroll-container': LayoutOrderSummaryScrollContainerComponent,
  'order-summary-line-item'       : LayoutOrderSummaryLineItemComponent,
  'expansion-panel-header'        : LayoutExpansionPanelHeaderComponent,
  'expansion-panel-content'       : LayoutExpansionPanelContentComponent,
  'drawer'                        : LayoutDrawerComponent,
  'drawer-header'                 : LayoutDrawerHeaderComponent,
  'drawer-content'                : LayoutDrawerContentComponent,
  'menu'                          : LayoutMenuComponent,
  'menu-item'                     : LayoutMenuItemComponent,
  'list'                          : LayoutListComponent,
  'dialog-content'                : LayoutDialogContentComponent,
  'dialog-actions'                : LayoutDialogActionsComponent,
  'expansion-panel-standalone'    : LayoutExpansionPanelStandaloneComponent,
  'wizard'                        : LayoutWizardComponent,
  'wizard-stepper-content'        : LayoutWizardStepperContentComponent,


  // Special layouts
  'heading'              : LayoutHeadingComponent,
  'span'                 : LayoutSpanComponent,
  'sup'                  : LayoutSupComponent,
  'sub'                  : LayoutSubComponent,
  'anchor'               : LayoutAnchorComponent,
  'paragraph'            : LayoutParagraphComponent,
  'button'               : LayoutButtonComponent,
  'badge'                : LayoutBadgeComponent,
  'stepper-next'         : LayoutStepperNextComponent,
  'stepper-previous'     : LayoutStepperPreviousComponent,
  'array-item-add'       : LayoutArrayItemAddComponent,
  'array-item-remove'    : LayoutArrayItemRemoveComponent,
  'image'                : LayoutImageComponent,
  'icon'                 : LayoutIconComponent,
  'progress-bar'         : LayoutProgressBarComponent,
  'hr'                   : LayoutHrComponent,
  'd3'                   : LayoutD3Component,
  'chartjs'              : LayoutChartJSComponent,
  'custom-component'     : LayoutCustomComponentComponent,
  'render-2d'            : LayoutRender2DComponent,
  'render-3d'            : LayoutRender3DComponent,
  'html'                 : LayoutHtmlComponent,
  'iframe'               : LayoutIframeComponent,
  'progress-tracker'     : LayoutProgressTrackerComponent,
  'progress-tracker-step': LayoutProgressTrackerStepComponent,
  'app-breadcrumbs'      : LayoutAppBreadcrumbsComponent,
  'app-page-title'       : LayoutAppPageTitleComponent,
  'powered-by'           : LayoutPoweredByComponent,
  'wizard-stepper-header': LayoutWizardStepperHeaderComponent
};

@Component({
  selector       : 'jsf-layout-router',
  template       : `
      <ng-container #routerOutlet></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
      `
          :host(.hidden) {
              display: none !important;
          }
    `
  ]
})
export class LayoutRouterComponent extends RouterComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  layoutBuilder: JsfUnknownLayoutBuilder;

  @HostBinding('attr.jsf-layout-id')
  idAttr;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChild('routerOutlet', { read: ViewContainerRef, static: true })
  private routerOutlet: ViewContainerRef;

  @HostBinding('attr.matTooltip')
  matTooltipDirective: MatTooltip;

  @HostBinding('attr.title')
  title: string;

  // Reference to the created layout component.
  private componentRef: ComponentRef<AbstractLayoutComponent>;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private cdRef: ChangeDetectorRef,
              @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig,
              private componentFactoryResolver: ComponentFactoryResolver,
              @SkipSelf() protected parentCdRef: ChangeDetectorRef,
              private overlay: Overlay,
              private elementRef: ElementRef<HTMLElement>,
              private scrollDispatcher: ScrollDispatcher,
              private viewContainerRef: ViewContainerRef,
              private ngZone: NgZone,
              private platform: Platform,
              private ariaDescriber: AriaDescriber,
              private focusMonitor: FocusMonitor,
              @Inject(MAT_TOOLTIP_SCROLL_STRATEGY) private scrollStrategy: any,
              @Optional() private dir: Directionality,
              @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS) private defaultOptions: MatTooltipDefaultOptions,
              @Optional() @Inject(HAMMER_LOADER) private hammerLoader?: HammerLoader) {
    super();
  }

  get debug() {
    return this.layoutBuilder && this.layoutBuilder.rootBuilder && this.layoutBuilder.rootBuilder.debug;
  }

  get docDefPath() {
    return this.layoutBuilder.docDefPath;
  }

  get propDocDefPath() {
    return this.propBuilder && this.propBuilder.docDefPath;
  }

  get propBuilder() {
    if (this.layoutBuilder.type === 'prop') {
      return (this.layoutBuilder as JsfPropLayoutBuilder).propBuilder;
    }
  }

  ngOnInit() {
    this.idAttr   = this.layoutBuilder.id;
    this.isHidden = !this.layoutBuilder.visible;

    if (this.layoutBuilder.rootBuilder.doc?.$engine?.visibilityHandler !== 'angular') {
      if (!isNil(this.layoutBuilder.rootBuilder.doc.$engine?.layoutRenderingMode)) {
        if (this.layoutBuilder.rootBuilder.doc.$engine?.layoutRenderingMode === 'sync') {
          this.tryCreateComponent();
        } else {
          setTimeout(() => {
            this.tryCreateComponent();
          }, 0);
        }
      } else {
        if (this.jsfAppConfig.syncLayoutRendering) {
          this.tryCreateComponent();
        } else {
          setTimeout(() => {
            this.tryCreateComponent();
          }, 0);
        }
      }
    }

    this.layoutBuilder.visibleObservable
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(next => {
        this.isHidden = !next;
        this.detectChanges();
        this.updateRenderedComponent();
      });

    this.detectChanges();

    // Tooltip handling
    if (this.tooltipTemplateData) {
      if (this.tooltipDependencies.length) {
        for (const dependency of this.tooltipDependencies) {
          const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
          this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status) => {
              if (status.status !== PropStatus.Pending) {
                this.updateTooltip();
                this.detectChanges();
              }
            });
        }
      } else {
        if (this.layoutBuilder.rootBuilder.warnings) {
          console.warn(`Layout router [${ this.layoutBuilder.id }] uses tooltip templateData but has not listed any dependencies.`,
            `The component will be updated on every form value change which may decrease performance.`);
        }
        this.layoutBuilder.rootBuilder.propBuilder.statusChange
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((status: PropStatus) => {
            if (status !== PropStatus.Pending) {
              this.updateTooltip();
              this.detectChanges();
            }
          });
      }
    }
  }

  public ngAfterViewInit(): void {
  }

  /**
   * Destroy.
   */
  ngOnDestroy(): void {
    // Unsubscribe from all observables.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    if (this.matTooltipDirective) {
      this.matTooltipDirective.ngOnDestroy();
    }

    this.destroyComponent();
  }


  private detectChanges() {
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();

    /**
     * We must trigger change detection on the parent component, because host property bindings are part
     * of that component's view.
     */
    if (this.parentCdRef) {
      this.parentCdRef.markForCheck();
      this.parentCdRef.detectChanges();
    }
  }

  private updateRenderedComponent() {
    if (this.layoutBuilder.rootBuilder.doc?.$engine?.visibilityHandler !== 'angular') {
      return;
    }

    if (this.isHidden) {
      this.destroyComponent();
    } else {
      this.tryCreateComponent();
    }
  }

  private tryCreateComponent() {
    try {
      this.createComponent();
    } catch (e) {
      console.error(e);
    } finally {
      this.layoutBuilder.decreaseLayoutLoadingCount();
    }
  }

  private createComponent() {
    const vcRef = this.routerOutlet;
    vcRef.clear();

    const component = componentList[this.layoutBuilder.type];
    if (!component) {
      throw new Error(`Unknown layout ${ JSON.stringify(this.layoutBuilder.layout) }`);
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<AbstractLayoutComponent>(component);
    this.componentRef      = vcRef.createComponent(componentFactory);

    // Set input values
    this.componentRef.instance.layoutBuilder = this.layoutBuilder;

    // Set directives
    if (this.tooltipEnabled) {
      this.matTooltipDirective = new MatTooltip(
        this.overlay,
        this.elementRef,
        this.scrollDispatcher,
        this.viewContainerRef,
        this.ngZone,
        this.platform,
        this.ariaDescriber,
        this.focusMonitor,
        this.scrollStrategy,
        this.dir,
        this.defaultOptions,
        this.hammerLoader
      );

      this.matTooltipDirective.ngOnInit();

      this.updateTooltip();
    }

    // Set tooltip title
    if (this.tooltipAttributeTitle) {
      this.title = this.tooltipAttributeTitle;
    }

    // Run change detection
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private destroyComponent() {
    this.routerOutlet.clear();
    this.componentRef = null;
  }

  private updateTooltip() {
    this.title = this.tooltipAsAttribute ? this.tooltipAttributeTitle : null;

    if (!this.matTooltipDirective) {
      return;
    }

    this.matTooltipDirective.disabled = !this.tooltipEnabled;
    this.matTooltipDirective.message  = this.tooltip;
    this.matTooltipDirective.position = this.tooltipPosition;
  }

  /**
   * Tooltips
   */
  get tooltipAsAttribute() {
    if (this.isTooltipDataObject(this.layout.tooltip)) {
      return this.layout.tooltip.displayAsTitleAttribute || false;
    }
    return false;
  }

  get tooltipAttributeTitle() {
    return this.tooltipAsAttribute ? this.tooltip : null;
  }

  get tooltipEnabled() {
    return this.tooltip && !this.tooltipAsAttribute;
  }

  get tooltipPosition() {
    if (this.isTooltipDataObject(this.layout.tooltip)) {
      return this.layout.tooltip.position || 'below';
    }
    return 'below';
  }

  get tooltip() {
    const tooltipText = this.isTooltipDataObject(this.layout.tooltip)
      ? this.layout.tooltip.title
      : this.layout.tooltip as string;

    if (typeof tooltipText === 'object' && !('title' in tooltipText)) {
      return void 0;
    }

    const templateData = this.tooltipTemplateData;

    if (templateData) {
      const template = this.translationServer.getTemplate(this.i18n(tooltipText));
      return template(templateData);
    }

    return this.i18n(tooltipText);
  }

  get tooltipTemplateData(): any {
    if (this.isTooltipDataObject(this.layout.tooltip) && this.layout.tooltip.templateData) {

      const ctx = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder: this.layoutBuilder
      });
      return this.layoutBuilder.rootBuilder.runEvalWithContext(
        (this.layout.tooltip.templateData as any).$evalTranspiled
        || this.layout.tooltip.templateData.$eval, ctx);

    }
  }

  get tooltipDependencies(): string[] {
    if (this.isTooltipDataObject(this.layout.tooltip) && this.layout.tooltip.templateData) {
      return this.layout.tooltip.templateData.dependencies ? this.layout.tooltip.templateData.dependencies || [] : [];
    }
    return [];
  }


  private isTooltipDataObject(x: any): x is {
    title: string;
    templateData?: {
      $eval: string;
    };
    position?: 'above' | 'below' | 'left' | 'right' | 'before' | 'after';
    displayAsTitleAttribute: boolean;
  } {
    return typeof x === 'object' && 'title' in x;
  }
}
