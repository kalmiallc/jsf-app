import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
}                                                 from '@angular/core';
import { Bind, JsfLayoutEditor }                  from '@kalmia/jsf-common-es2015';
import { LbDefaultComponent }                     from '../layout-builder-library/lb-default.component';
import { LbRowComponent }                         from '../layout-builder-library/items-layout/row/lb-row.component';
import { LbDivComponent }                         from '../layout-builder-library/items-layout/div/lb-div.component';
import { LbStepperComponent }                     from '../layout-builder-library/items-layout/stepper/lb-stepper.component';
import { LbHeadingComponent }                     from '../layout-builder-library/special-layout/heading/lb-heading.component';
import { LbListComponent }                        from '../layout-builder-library/items-layout/list/lb-list.component';
import { LbMenuComponent }                        from '../layout-builder-library/items-layout/menu/lb-menu.component';
import { LbMenuItemComponent }                    from '../layout-builder-library/items-layout/menu-item/lb-menu-item.component';
import { LbImageComponent }                       from '../layout-builder-library/special-layout/image/lb-image.component';
import { LbTabsetComponent }                      from '../layout-builder-library/items-layout/tabset/lb-tabset.component';
import { LbOrderSummaryComponent }                from '../layout-builder-library/items-layout/order-summary/lb-order-summary.component';
import { LbOrderSummaryOverlayComponent }         from '../layout-builder-library/items-layout/order-summary-overlay/lb-order-summary-overlay.component';
import { LbOrderSummaryScrollContainerComponent } from '../layout-builder-library/items-layout/order-summary-scroll-container/lb-order-summary-scroll-container.component';
import { LbOrderSummaryLineItemComponent }        from '../layout-builder-library/special-layout/order-summary-line-item/lb-order-summary-line-item.component';
import { LbExpansionPanelHeaderComponent }        from '../layout-builder-library/items-layout/expansion-panel-header/lb-expansion-panel-header.component';
import { LbExpansionPanelContentComponent }       from '../layout-builder-library/items-layout/expansion-panel-content/lb-expansion-panel-content.component';
import { LbDrawerComponent }                      from '../layout-builder-library/items-layout/drawer/lb-drawer.component';
import { LbDrawerHeaderComponent }                from '../layout-builder-library/items-layout/drawer-header/lb-drawer-header.component';
import { LbDrawerContentComponent }               from '../layout-builder-library/items-layout/drawer-content/lb-drawer-content.component';
import { LbDialogContentComponent }               from '../layout-builder-library/items-layout/dialog-content/lb-dialog-content.component';
import { LbDialogActionsComponent }               from '../layout-builder-library/items-layout/dialog-actions/lb-dialog-actions.component';
import { LbSpanComponent }                        from '../layout-builder-library/special-layout/span/lb-span.component';
import { LbSupComponent }                         from '../layout-builder-library/special-layout/sup/lb-sup.component';
import { LbSubComponent }                         from '../layout-builder-library/special-layout/sub/lb-sub.component';
import { LbAnchorComponent }                      from '../layout-builder-library/special-layout/anchor/lb-anchor.component';
import { LbParagraphComponent }                   from '../layout-builder-library/special-layout/paragraph/lb-paragraph.component';
import { LbButtonComponent }                      from '../layout-builder-library/special-layout/button/lb-button.component';
import { LbBadgeComponent }                       from '../layout-builder-library/special-layout/badge/lb-badge.component';
import { LbStepperNextComponent }                 from '../layout-builder-library/special-layout/stepper-next/lb-stepper-next.component';
import { LbStepperPreviousComponent }             from '../layout-builder-library/special-layout/stepper-previous/lb-stepper-previous.component';
import { LbArrayItemAddComponent }                from '../layout-builder-library/special-layout/array-item-add/lb-array-item-add.component';
import { LbArrayItemRemoveComponent }             from '../layout-builder-library/special-layout/array-item-remove/lb-array-item-remove.component';
import { LbIconComponent }                        from '../layout-builder-library/special-layout/icon/lb-icon.component';
import { LbProgressBarComponent }                 from '../layout-builder-library/special-layout/progress-bar/lb-progress-bar.component';
import { LbHrComponent }                          from '../layout-builder-library/special-layout/hr/lb-hr.component';
import { LbD3Component }                          from '../layout-builder-library/special-layout/d3/lb-d3.component';
import { LbCustomComponentComponent }             from '../layout-builder-library/special-layout/custom-component/lb-custom-component.component';
import { LbHtmlComponent }                        from '../layout-builder-library/special-layout/html/lb-html.component';
import { LbIframeComponent }                      from '../layout-builder-library/special-layout/iframe/lb-iframe.component';
import { LbProgressTrackerComponent }             from '../layout-builder-library/items-layout/progress-tracker/lb-progress-tracker.component';
import { LbProgressTrackerStepComponent }         from '../layout-builder-library/special-layout/progress-tracker-step/lb-progress-tracker-step.component';
import { LbAppBreadcrumbsComponent }              from '../layout-builder-library/special-layout/app-breadcrumbs/lb-app-breadcrumbs.component';
import { LbAppPageTitleComponent }                from '../layout-builder-library/special-layout/app-page-title/lb-app-page-title.component';
import { LbColComponent }                         from '../layout-builder-library/items-layout/col/lb-col.component';
import { LbPoweredByComponent }                   from '../layout-builder-library/special-layout/powered-by/lb-powered-by.component';
import { LbStepComponent }                        from '../layout-builder-library/items-layout/step/lb-step.component';
import { LbChartJSComponent }                     from '../layout-builder-library/special-layout/chartjs/lb-chartjs.component';
import { LbRender2DComponent }                    from '../layout-builder-library/special-layout/render-2d/lb-render-2d.component';
import { LbRender3DComponent }                    from '../layout-builder-library/special-layout/render-3d/lb-render-3d.component';
import { LbPropComponent }                        from '../layout-builder-library/prop-layout/prop/lb-prop.component';
import { LbWizardComponent }                      from '../layout-builder-library/items-layout/wizard/lb-wizard.component';
import { LbWizardStepperContentComponent }        from '../layout-builder-library/items-layout/wizard-stepper-content/lb-wizard-stepper-content.component';
import { LbFloatingDivComponent }                 from '../layout-builder-library/items-layout/floating-div/lb-floating-div.component';
import { BuilderActionBarService }                from '../builder-action-bar.service';
import { Subject }                                from 'rxjs';
import { takeUntil }                              from 'rxjs/operators';


const componentList = {

  // Prop
  'prop': LbPropComponent,

  // Items layouts
  'div'                           : LbDivComponent,
  'floating-div'                  : LbFloatingDivComponent,
  'row'                           : LbRowComponent,
  'col'                           : LbColComponent,
  'tabset'                        : LbTabsetComponent,
  'stepper'                       : LbStepperComponent,
  'step'                          : LbStepComponent,
  'order-summary'                 : LbOrderSummaryComponent,
  'order-summary-overlay'         : LbOrderSummaryOverlayComponent,
  'order-summary-scroll-container': LbOrderSummaryScrollContainerComponent,
  'order-summary-line-item'       : LbOrderSummaryLineItemComponent,
  'expansion-panel-header'        : LbExpansionPanelHeaderComponent,
  'expansion-panel-content'       : LbExpansionPanelContentComponent,
  'drawer'                        : LbDrawerComponent,
  'drawer-header'                 : LbDrawerHeaderComponent,
  'drawer-content'                : LbDrawerContentComponent,
  'menu'                          : LbMenuComponent,
  'menu-item'                     : LbMenuItemComponent,
  'list'                          : LbListComponent,
  'dialog-content'                : LbDialogContentComponent,
  'dialog-actions'                : LbDialogActionsComponent,
  'wizard'                        : LbWizardComponent,
  'wizard-stepper-content'        : LbWizardStepperContentComponent,

  // Special layouts
  'heading'              : LbHeadingComponent,
  'span'                 : LbSpanComponent,
  'sup'                  : LbSupComponent,
  'sub'                  : LbSubComponent,
  'anchor'               : LbAnchorComponent,
  'paragraph'            : LbParagraphComponent,
  'button'               : LbButtonComponent,
  'badge'                : LbBadgeComponent,
  'stepper-next'         : LbStepperNextComponent,
  'stepper-previous'     : LbStepperPreviousComponent,
  'array-item-add'       : LbArrayItemAddComponent,
  'array-item-remove'    : LbArrayItemRemoveComponent,
  'image'                : LbImageComponent,
  'icon'                 : LbIconComponent,
  'progress-bar'         : LbProgressBarComponent,
  'hr'                   : LbHrComponent,
  'd3'                   : LbD3Component,
  'chartjs'              : LbChartJSComponent,
  'custom-component'     : LbCustomComponentComponent,
  'render-2d'            : LbRender2DComponent,
  'render-3d'            : LbRender3DComponent,
  'html'                 : LbHtmlComponent,
  'iframe'               : LbIframeComponent,
  'progress-tracker'     : LbProgressTrackerComponent,
  'progress-tracker-step': LbProgressTrackerStepComponent,
  'app-breadcrumbs'      : LbAppBreadcrumbsComponent,
  'app-page-title'       : LbAppPageTitleComponent,
  'powered-by'           : LbPoweredByComponent

};

@Component({
  selector       : 'jsf-layout-builder-router',
  template       : `
      <jsf-layout-builder-router-draggable>
          <ng-container #routerOutlet></ng-container>
      </jsf-layout-builder-router-draggable>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LayoutBuilderRouterComponent implements OnInit, OnDestroy, AfterViewInit {

  private _initialized = false;

  // Reference to the created layout component.
  private componentRef: ComponentRef<any>;

  private _layoutEditor: JsfLayoutEditor;
  @Input()
  public get layoutEditor(): JsfLayoutEditor {
    return this._layoutEditor;
  }

  public set layoutEditor(value: JsfLayoutEditor) {
    if (this._layoutEditor !== value) {
      this._layoutEditor = value;
      this.createComponent();

      if (this._layoutEditor) {
        this._layoutEditor.updateLayout$
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.detectChanges();
          });
      }
    }
  }

  @ViewChild('routerOutlet', { read: ViewContainerRef, static: true })
  private routerOutlet: ViewContainerRef;

  @Input()
  @HostBinding('attr.jsf-layout-builder-id')
  idAttr;

  @Input()
  @HostBinding('class')
  elementClass?: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  get jsfEditor() {
    return this._layoutEditor.jsfEditor;
  }

  constructor(private cdRef: ChangeDetectorRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private renderer: Renderer2,
              private actionBarService: BuilderActionBarService) {
  }

  ngOnInit() {
  }

  /**
   * Destroy.
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ngAfterViewInit(): void {
    this._initialized = true;
    this.createComponent();
  }

  private detectChanges() {
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  @Bind()
  private builderComponentClick(event: MouseEvent) {
    event.stopPropagation();
    this.actionBarService.select(this._layoutEditor, this.componentRef.instance, this.componentRef.location);
  }

  private createComponent() {
    if (!this._initialized) {
      return;
    }

    const vcRef = this.routerOutlet;
    vcRef.clear();

    let component = componentList[this._layoutEditor.realType];
    if (!component) {
      console.error(`Unknown layout ${ JSON.stringify(this._layoutEditor.realType) }`);
      component = LbDefaultComponent;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<any>(component);
    this.componentRef      = vcRef.createComponent(componentFactory);

    // Set input values.
    this.componentRef.instance.layoutEditor = this.layoutEditor;

    // Add event listeners.
    this.renderer.listen(this.componentRef.location.nativeElement, 'click', this.builderComponentClick);

    // Mark for change detection.
    this.componentRef.changeDetectorRef.markForCheck();
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
