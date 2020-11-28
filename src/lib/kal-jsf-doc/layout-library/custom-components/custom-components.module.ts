import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { MatRippleModule }              from '@angular/material/core';
import { MatIconModule }                from '@angular/material/icon';
import { MatStepperModule }             from '@angular/material/stepper';
import { MatTabsModule }                from '@angular/material/tabs';
import { JsfErrorMessagesComponent }    from './error-message/jsf-error-messages.component';
import { JsfDirectivesModule }          from '../../directives/jsf-directives.module';
import { JsfOverlayComponent }          from './overlay/jsf-overlay.component';
import { JsfLoadingIndicatorComponent } from './loading-indicator/jsf-loading-indicator.component';
import { ObserversModule }              from '@angular/cdk/observers';
import { PortalModule }                 from '@angular/cdk/portal';
import { JsfIconComponent }             from './icon/jsf-icon.component';
import { CodeEditorComponent }          from './code-editor/code-editor.component';
import { MonacoEditorModule }           from 'ngx-monaco-editor';
import { OverlayModule }                from '@angular/cdk/overlay';
import { FormsModule }                  from '@angular/forms';

@NgModule({
  imports     : [
    CommonModule,
    PortalModule,
    MatRippleModule,
    ObserversModule,
    MatStepperModule,
    MatTabsModule,
    MatIconModule,
    OverlayModule,
    FormsModule,
    MonacoEditorModule,
    JsfDirectivesModule
  ],
  declarations: [
    JsfErrorMessagesComponent,
    JsfOverlayComponent,
    JsfLoadingIndicatorComponent,
    JsfIconComponent,
    CodeEditorComponent
  ],
  exports: [
    JsfErrorMessagesComponent,
    JsfOverlayComponent,
    JsfLoadingIndicatorComponent,
    JsfIconComponent,
    CodeEditorComponent
  ]
})
export class JsfCustomComponentsModule {}
