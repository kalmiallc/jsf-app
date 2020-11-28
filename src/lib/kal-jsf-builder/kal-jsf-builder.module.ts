import { NgModule }                                  from '@angular/core';
import { CommonModule }                              from '@angular/common';
import { KalJsfBuilderComponent }                    from './kal-jsf-builder.component';
import { MatTreeModule }                             from '@angular/material/tree';
import { JsfModule }                                 from '../jsf.module';
import { MonacoEditorModule }                        from 'ngx-monaco-editor';
import { FormsModule }                               from '@angular/forms';
import { MatMenuModule }                             from '@angular/material/menu';
import { MatIconModule }                             from '@angular/material/icon';
import { MatCheckboxModule }                         from '@angular/material/checkbox';
import { MatTooltipModule }                          from '@angular/material/tooltip';
import { MatButtonToggleModule }                     from '@angular/material/button-toggle';
import { MatButtonModule }                           from '@angular/material/button';
import { MatTabsModule }                             from '@angular/material/tabs';
import { MatSidenavModule }                          from '@angular/material/sidenav';
import { KalJsfBuilderSchemaComponent }              from './kal-jsf-builder-schema/kal-jsf-builder-schema.component';
import { KalJsfBuilderLayoutComponent }              from './kal-jsf-builder-layout/kal-jsf-builder-layout.component';
import { DragDropModule }                            from '@angular/cdk/drag-drop';
import { CdkTreeModule }                             from '@angular/cdk/tree';
import { MatExpansionModule }                        from '@angular/material/expansion';
import { MatGridListModule }                         from '@angular/material/grid-list';
import { MatCardModule }                             from '@angular/material/card';
import { KalJsfBuilderConfigComponent }              from './kal-jsf-builder-config/kal-jsf-builder-config.component';
import { MatFormFieldModule }                        from '@angular/material/form-field';
import { MatChipsModule }                            from '@angular/material/chips';
import { MatSortModule }                             from '@angular/material/sort';
import { KalJsfBuilderPreviewComponent }             from './kal-jsf-builder-preview/kal-jsf-builder-preview.component';
import { LayoutBuilderRouterItemsComponent }         from './kal-jsf-builder-layout/routers/layout-builder-router-items.component';
import { LayoutBuilderRouterComponent }              from './kal-jsf-builder-layout/routers/layout-builder-router.component';
import { LbDefaultComponent }                        from './kal-jsf-builder-layout/layout-builder-library/lb-default.component';
import { LbRowComponent }                            from './kal-jsf-builder-layout/layout-builder-library/items-layout/row/lb-row.component';
import { LbDivComponent }                            from './kal-jsf-builder-layout/layout-builder-library/items-layout/div/lb-div.component';
import { LbStepperComponent }                        from './kal-jsf-builder-layout/layout-builder-library/items-layout/stepper/lb-stepper.component';
import { LbHeadingComponent }                        from './kal-jsf-builder-layout/layout-builder-library/special-layout/heading/lb-heading.component';
import { MatProgressBarModule }                      from '@angular/material/progress-bar';
import { MatRippleModule }                           from '@angular/material/core';
import { OverlayModule }                             from '@angular/cdk/overlay';
import { NgxDnDModule }                              from '@swimlane/ngx-dnd';
import { KalJsfBuilderCommonModule }                 from './kal-jsf-builder-common/kal-jsf-builder-common.module';
import { AbstractLayoutBuilderComponent }            from './kal-jsf-builder-layout/abstract/abstract-layout-builder.component';
import { LayoutBuilderRouterDraggableComponent }     from './kal-jsf-builder-layout/routers/utils/layout-builder-router-draggable.component';
import { LayoutBuilderRouterDroppableComponent }     from './kal-jsf-builder-layout/routers/utils/layout-builder-router-droppable.component';
import { LbListComponent }                           from './kal-jsf-builder-layout/layout-builder-library/items-layout/list/lb-list.component';
import { LbMenuComponent }                           from './kal-jsf-builder-layout/layout-builder-library/items-layout/menu/lb-menu.component';
import { LbMenuItemComponent }                       from './kal-jsf-builder-layout/layout-builder-library/items-layout/menu-item/lb-menu-item.component';
import { LbImageComponent }                          from './kal-jsf-builder-layout/layout-builder-library/special-layout/image/lb-image.component';
import { LbOrderSummaryComponent }                   from './kal-jsf-builder-layout/layout-builder-library/items-layout/order-summary/lb-order-summary.component';
import { LbOrderSummaryOverlayComponent }            from './kal-jsf-builder-layout/layout-builder-library/items-layout/order-summary-overlay/lb-order-summary-overlay.component';
import { LbOrderSummaryScrollContainerComponent }    from './kal-jsf-builder-layout/layout-builder-library/items-layout/order-summary-scroll-container/lb-order-summary-scroll-container.component';
import { LbOrderSummaryLineItemComponent }           from './kal-jsf-builder-layout/layout-builder-library/special-layout/order-summary-line-item/lb-order-summary-line-item.component';
import { LbExpansionPanelHeaderComponent }           from './kal-jsf-builder-layout/layout-builder-library/items-layout/expansion-panel-header/lb-expansion-panel-header.component';
import { LbExpansionPanelContentComponent }          from './kal-jsf-builder-layout/layout-builder-library/items-layout/expansion-panel-content/lb-expansion-panel-content.component';
import { LbDrawerComponent }                         from './kal-jsf-builder-layout/layout-builder-library/items-layout/drawer/lb-drawer.component';
import { LbDrawerHeaderComponent }                   from './kal-jsf-builder-layout/layout-builder-library/items-layout/drawer-header/lb-drawer-header.component';
import { LbDrawerContentComponent }                  from './kal-jsf-builder-layout/layout-builder-library/items-layout/drawer-content/lb-drawer-content.component';
import { LbDialogContentComponent }                  from './kal-jsf-builder-layout/layout-builder-library/items-layout/dialog-content/lb-dialog-content.component';
import { LbDialogActionsComponent }                  from './kal-jsf-builder-layout/layout-builder-library/items-layout/dialog-actions/lb-dialog-actions.component';
import { LbSpanComponent }                           from './kal-jsf-builder-layout/layout-builder-library/special-layout/span/lb-span.component';
import { LbSupComponent }                            from './kal-jsf-builder-layout/layout-builder-library/special-layout/sup/lb-sup.component';
import { LbSubComponent }                            from './kal-jsf-builder-layout/layout-builder-library/special-layout/sub/lb-sub.component';
import { LbAnchorComponent }                         from './kal-jsf-builder-layout/layout-builder-library/special-layout/anchor/lb-anchor.component';
import { LbParagraphComponent }                      from './kal-jsf-builder-layout/layout-builder-library/special-layout/paragraph/lb-paragraph.component';
import { LbButtonComponent }                         from './kal-jsf-builder-layout/layout-builder-library/special-layout/button/lb-button.component';
import { LbBadgeComponent }                          from './kal-jsf-builder-layout/layout-builder-library/special-layout/badge/lb-badge.component';
import { LbStepperNextComponent }                    from './kal-jsf-builder-layout/layout-builder-library/special-layout/stepper-next/lb-stepper-next.component';
import { LbStepperPreviousComponent }                from './kal-jsf-builder-layout/layout-builder-library/special-layout/stepper-previous/lb-stepper-previous.component';
import { LbArrayItemAddComponent }                   from './kal-jsf-builder-layout/layout-builder-library/special-layout/array-item-add/lb-array-item-add.component';
import { LbArrayItemRemoveComponent }                from './kal-jsf-builder-layout/layout-builder-library/special-layout/array-item-remove/lb-array-item-remove.component';
import { LbIconComponent }                           from './kal-jsf-builder-layout/layout-builder-library/special-layout/icon/lb-icon.component';
import { LbProgressBarComponent }                    from './kal-jsf-builder-layout/layout-builder-library/special-layout/progress-bar/lb-progress-bar.component';
import { LbHrComponent }                             from './kal-jsf-builder-layout/layout-builder-library/special-layout/hr/lb-hr.component';
import { LbD3Component }                             from './kal-jsf-builder-layout/layout-builder-library/special-layout/d3/lb-d3.component';
import { LbChartJSComponent }                        from './kal-jsf-builder-layout/layout-builder-library/special-layout/chartjs/lb-chartjs.component';
import { LbCustomComponentComponent }                from './kal-jsf-builder-layout/layout-builder-library/special-layout/custom-component/lb-custom-component.component';
import { LbRender2DComponent }                       from './kal-jsf-builder-layout/layout-builder-library/special-layout/render-2d/lb-render-2d.component';
import { LbHtmlComponent }                           from './kal-jsf-builder-layout/layout-builder-library/special-layout/html/lb-html.component';
import { LbIframeComponent }                         from './kal-jsf-builder-layout/layout-builder-library/special-layout/iframe/lb-iframe.component';
import { LbProgressTrackerComponent }                from './kal-jsf-builder-layout/layout-builder-library/items-layout/progress-tracker/lb-progress-tracker.component';
import { LbProgressTrackerStepComponent }            from './kal-jsf-builder-layout/layout-builder-library/special-layout/progress-tracker-step/lb-progress-tracker-step.component';
import { LbAppBreadcrumbsComponent }                 from './kal-jsf-builder-layout/layout-builder-library/special-layout/app-breadcrumbs/lb-app-breadcrumbs.component';
import { LbAppPageTitleComponent }                   from './kal-jsf-builder-layout/layout-builder-library/special-layout/app-page-title/lb-app-page-title.component';
import { LbPoweredByComponent }                      from './kal-jsf-builder-layout/layout-builder-library/special-layout/powered-by/lb-powered-by.component';
import { LbTabsetComponent }                         from './kal-jsf-builder-layout/layout-builder-library/items-layout/tabset/lb-tabset.component';
import { LbColComponent }                            from './kal-jsf-builder-layout/layout-builder-library/items-layout/col/lb-col.component';
import { LbOrderSummaryStaticContainerComponent }    from './kal-jsf-builder-layout/layout-builder-library/items-layout/order-summary-static-container/lb-order-summary-static-container.component';
import { LbStepComponent }                           from './kal-jsf-builder-layout/layout-builder-library/items-layout/step/lb-step.component';
import { LbPropComponent }                           from './kal-jsf-builder-layout/layout-builder-library/prop-layout/prop/lb-prop.component';
import { MatInputModule }                            from '@angular/material/input';
import { KalJsfBuilderHandlerDialogComponent }       from './kal-jsf-builder-common/kal-jsf-builder-handler-dialog/kal-jsf-builder-handler-dialog.component';
import { MatDialogModule }                           from '@angular/material/dialog';
import { LbPropHandlerDefaultComponent }             from './kal-jsf-builder-layout/layout-builder-library/prop-layout/prop/lb-prop-handler-default.component';
import { AbstractPropHandlerLayoutBuilderComponent } from './kal-jsf-builder-layout/abstract/abstract-prop-handler-layout-builder.component';
import { LbRender3DComponent }                       from './kal-jsf-builder-layout/layout-builder-library/special-layout/render-3d/lb-render-3d.component';
import { KalJsfBuilderExportComponent }              from './kal-jsf-builder-export/kal-jsf-builder-export.component';
import { KalJsfPageModule }                          from '../kal-jsf-page/kal-jsf-page.module';
import { KalJsfBuilderTranslationsComponent }        from './kal-jsf-builder-translations/kal-jsf-builder-translations.component';
import { MatProgressSpinnerModule }                  from '@angular/material/progress-spinner';
import { MatDatepickerModule }                       from '@angular/material/datepicker';
import { LbWizardComponent }                         from './kal-jsf-builder-layout/layout-builder-library/items-layout/wizard/lb-wizard.component';
import { LbWizardStepperContentComponent }           from './kal-jsf-builder-layout/layout-builder-library/items-layout/wizard-stepper-content/lb-wizard-stepper-content.component';
import { MatSelectModule }                           from '@angular/material/select';
import { KeyboardShortcutsModule }                   from 'ng-keyboard-shortcuts';
import { MatSnackBarModule }                         from '@angular/material/snack-bar';


@NgModule({
  imports     : [
    CommonModule,
    JsfModule,
    KalJsfBuilderCommonModule,
    MatTreeModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatGridListModule,
    MatSnackBarModule,
    MatIconModule,
    MatSidenavModule,
    MatTooltipModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule,
    MatRippleModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    CdkTreeModule,
    OverlayModule,
    MatSortModule,
    DragDropModule,
    NgxDnDModule,
    MonacoEditorModule,
    FormsModule,
    KalJsfPageModule,
    KeyboardShortcutsModule
  ],
  declarations: [
    KalJsfBuilderComponent,
    KalJsfBuilderSchemaComponent,
    KalJsfBuilderLayoutComponent,
    KalJsfBuilderConfigComponent,
    KalJsfBuilderPreviewComponent,
    KalJsfBuilderTranslationsComponent,
    KalJsfBuilderExportComponent,
    AbstractLayoutBuilderComponent,
    AbstractPropHandlerLayoutBuilderComponent,
    LbDefaultComponent,
    LbRowComponent,
    LbDivComponent,
    LbStepperComponent,
    LbStepComponent,
    LayoutBuilderRouterComponent,
    LayoutBuilderRouterItemsComponent,
    LayoutBuilderRouterDraggableComponent,
    LayoutBuilderRouterDroppableComponent,
    LbHeadingComponent,
    LbColComponent,
    LbListComponent,
    LbMenuComponent,
    LbMenuItemComponent,
    LbImageComponent,
    LbTabsetComponent,
    LbOrderSummaryComponent,
    LbOrderSummaryOverlayComponent,
    LbOrderSummaryScrollContainerComponent,
    LbOrderSummaryStaticContainerComponent,
    LbOrderSummaryLineItemComponent,
    LbExpansionPanelHeaderComponent,
    LbExpansionPanelContentComponent,
    LbDrawerComponent,
    LbDrawerHeaderComponent,
    LbDrawerContentComponent,
    LbDialogContentComponent,
    LbDialogActionsComponent,
    LbSpanComponent,
    LbSupComponent,
    LbSubComponent,
    LbAnchorComponent,
    LbParagraphComponent,
    LbButtonComponent,
    LbBadgeComponent,
    LbStepperNextComponent,
    LbStepperPreviousComponent,
    LbArrayItemAddComponent,
    LbArrayItemRemoveComponent,
    LbIconComponent,
    LbProgressBarComponent,
    LbHrComponent,
    LbD3Component,
    LbChartJSComponent,
    LbCustomComponentComponent,
    LbRender2DComponent,
    LbRender3DComponent,
    LbHtmlComponent,
    LbIframeComponent,
    LbProgressTrackerComponent,
    LbProgressTrackerStepComponent,
    LbAppBreadcrumbsComponent,
    LbAppPageTitleComponent,
    LbPoweredByComponent,
    LbPropComponent,
    LbWizardComponent,
    LbWizardStepperContentComponent,
    LbPropHandlerDefaultComponent,
    KalJsfBuilderHandlerDialogComponent
  ],
  exports     : [
    KalJsfBuilderComponent,

    LbDefaultComponent,
    LbRowComponent,
    LbDivComponent,
    LbStepperComponent,
    LbStepComponent,
    LayoutBuilderRouterComponent,
    LayoutBuilderRouterItemsComponent,
    LayoutBuilderRouterDroppableComponent,
    LayoutBuilderRouterDraggableComponent,
    LbHeadingComponent,
    LbColComponent,
    LbListComponent,
    LbMenuComponent,
    LbMenuItemComponent,
    LbImageComponent,
    LbTabsetComponent,
    LbOrderSummaryComponent,
    LbOrderSummaryOverlayComponent,
    LbOrderSummaryScrollContainerComponent,
    LbOrderSummaryStaticContainerComponent,
    LbOrderSummaryLineItemComponent,
    LbExpansionPanelHeaderComponent,
    LbExpansionPanelContentComponent,
    LbDrawerComponent,
    LbDrawerHeaderComponent,
    LbDrawerContentComponent,
    LbDialogContentComponent,
    LbDialogActionsComponent,
    LbSpanComponent,
    LbSupComponent,
    LbSubComponent,
    LbAnchorComponent,
    LbParagraphComponent,
    LbButtonComponent,
    LbBadgeComponent,
    LbStepperNextComponent,
    LbStepperPreviousComponent,
    LbArrayItemAddComponent,
    LbArrayItemRemoveComponent,
    LbIconComponent,
    LbProgressBarComponent,
    LbHrComponent,
    LbD3Component,
    LbChartJSComponent,
    LbCustomComponentComponent,
    LbRender2DComponent,
    LbRender3DComponent,
    LbHtmlComponent,
    LbIframeComponent,
    LbProgressTrackerComponent,
    LbProgressTrackerStepComponent,
    LbAppBreadcrumbsComponent,
    LbAppPageTitleComponent,
    LbPoweredByComponent,
    LbPropComponent,
    LbWizardComponent,
    LbWizardStepperContentComponent,
    LbPropHandlerDefaultComponent
  ]
})
export class KalJsfBuilderModule {}
