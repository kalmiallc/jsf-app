import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { JsfModule }           from '../jsf.module';
import { KalJsfPageComponent } from './kal-jsf-page.component';
import { SharedModule }        from '../kal-jsf-doc/shared/shared.module';

@NgModule({
  imports     : [
    CommonModule,
    JsfModule,
    SharedModule
  ],
  declarations: [
    KalJsfPageComponent
  ],
  exports     : [
    KalJsfPageComponent
  ]
})
export class KalJsfPageModule {}
