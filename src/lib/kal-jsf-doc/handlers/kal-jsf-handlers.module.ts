import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { ComponentComponent } from './component/component.component';
import { JsfModule }          from '../../jsf.module';
import { AnyComponent }       from './any/any.component';
import { FormsModule }        from '@angular/forms';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    JsfModule
  ],
  declarations: [
    ComponentComponent,
    AnyComponent
  ],
  exports     : [
    ComponentComponent
  ]
})
export class KalJsfHandlersModule {}
