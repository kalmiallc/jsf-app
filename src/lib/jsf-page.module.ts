import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { KalJsfPageModule } from './kal-jsf-page/kal-jsf-page.module';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    KalJsfPageModule
  ]
})
export class JsfPageModule {}
