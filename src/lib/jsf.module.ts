import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { KalJsfDocComponent }           from './kal-jsf-doc/kal-jsf-doc.component';
import { JsfThemeModule }               from './kal-jsf-doc/theme/jsf-theme.module';
import { JsfComponentsModule }          from './jsf-components.module';
import { SharedModule }                 from './kal-jsf-doc/shared/shared.module';
import { JsfScrollService }             from './kal-jsf-doc/services/scroll.service';
import { KalJsfFilterComponent }        from './kal-jsf-filter/kal-jsf-filter.component';
import { JsfFilterComponentsModule }    from './jsf-filter-components.module';
import { KalJsfFormControlComponent }   from './kal-jsf-form-control/kal-jsf-form-control.component';
import { KalJsfProxyDocComponent }      from './kal-jsf-proxy-doc/kal-jsf-proxy-doc.component';
import { KalJsfProxyFrameDocComponent } from './kal-jsf-proxy-doc/kal-jsf-proxy-frame-doc.component';

(window as any)._diagnostics = (window as any)._diagnostics || window.location.hostname === 'localhost';

@NgModule({
  imports     : [
    CommonModule,
    SharedModule,
    JsfComponentsModule,
    JsfFilterComponentsModule,
    JsfThemeModule
  ],
  providers   : [
    JsfScrollService
  ],
  declarations: [
    KalJsfDocComponent,
    KalJsfProxyDocComponent,
    KalJsfProxyFrameDocComponent,
    KalJsfFilterComponent,
    KalJsfFormControlComponent
  ],
  exports     : [
    KalJsfDocComponent,
    KalJsfProxyDocComponent,
    KalJsfFilterComponent,
    KalJsfFormControlComponent,
    JsfComponentsModule,
    JsfFilterComponentsModule
  ]
})
export class JsfModule {}
