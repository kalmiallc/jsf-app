import { NgModule }                                  from '@angular/core';
import { CommonModule }                              from '@angular/common';
import { MatRippleModule }                           from '@angular/material/core';
import { OverlayscrollbarsModule }                   from 'overlayscrollbars-ngx';
import { KalJsfBuilderContentComponent }             from './kal-jsf-builder-content/kal-jsf-builder-content.component';
import { KalJsfBuilderViewportComponent }            from './kal-jsf-builder-viewport/kal-jsf-builder-viewport.component';
import { KalJsfBuilderToolboxComponent }             from './kal-jsf-builder-toolbox/kal-jsf-builder-toolbox.component';
import { KalJsfBuilderCardButtonComponent }          from './kal-jsf-builder-card-button/kal-jsf-builder-card-button.component';
import { KalJsfBuilderCardButtonContainerComponent } from './kal-jsf-builder-card-button-container/kal-jsf-builder-card-button-container.component';
import { JsfDirectivesModule }                       from '../../kal-jsf-doc/directives/jsf-directives.module';
import { KalJsfBuilderActionBarComponent }           from './kal-jsf-builder-action-bar/kal-jsf-builder-action-bar.component';
import { KalJsfBuilderActionBarButtonComponent }     from './kal-jsf-builder-action-bar-button/kal-jsf-builder-action-bar-button.component';
import { JsfCustomComponentsModule }                 from '../../kal-jsf-doc/layout-library/custom-components/custom-components.module';
import { PortalModule }                              from '@angular/cdk/portal';
import { MatIconModule }                             from '@angular/material/icon';
import { MatDialogModule }                           from '@angular/material/dialog';


@NgModule({
  imports     : [
    CommonModule,
    PortalModule,
    MatRippleModule,
    MatIconModule,
    MatDialogModule,
    OverlayscrollbarsModule,
    JsfCustomComponentsModule,
    JsfDirectivesModule
  ],
  declarations: [
    KalJsfBuilderContentComponent,
    KalJsfBuilderViewportComponent,
    KalJsfBuilderToolboxComponent,
    KalJsfBuilderCardButtonComponent,
    KalJsfBuilderCardButtonContainerComponent,
    KalJsfBuilderActionBarComponent,
    KalJsfBuilderActionBarButtonComponent
  ],
  exports     : [
    KalJsfBuilderContentComponent,
    KalJsfBuilderViewportComponent,
    KalJsfBuilderToolboxComponent,
    KalJsfBuilderCardButtonComponent,
    KalJsfBuilderCardButtonContainerComponent,
    KalJsfBuilderActionBarButtonComponent
  ]
})
export class KalJsfBuilderCommonModule {}
