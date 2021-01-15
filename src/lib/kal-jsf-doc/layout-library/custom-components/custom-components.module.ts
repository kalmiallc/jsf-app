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
import { JsfInputComponent }            from './input/jsf-input.component';
import { JsfButtonComponent }           from './button/jsf-button.component';
import { JsfDropdownComponent }         from './dropdown/jsf-dropdown.component';
import { MonacoEditorModule }           from 'ngx-monaco-editor';
import { OverlayModule }                from '@angular/cdk/overlay';
import { FormsModule }                  from '@angular/forms';
import { NgxMatSelectSearchModule }     from 'ngx-mat-select-search';
import { SharedModule }                 from '../../shared/shared.module';
import { JsfBadgeComponent }            from './badge/jsf-badge.component';
import { JsfChipListComponent }         from './chip-list/jsf-chip-list.component';
import { MatChipsModule }               from '@angular/material/chips';
import { MatAutocompleteModule }        from '@angular/material/autocomplete';
import { JsfFileUploadComponent }       from './file-upload/jsf-file-upload.component';
import { FileUploadModule }             from 'ng2-file-upload';
import { MatProgressSpinnerModule }     from '@angular/material/progress-spinner';
import { MatProgressBarModule }         from '@angular/material/progress-bar';
import { MatSnackBarModule }            from '@angular/material/snack-bar';
import { JsfPipesModule }               from '../../pipes/jsf-pipes.module';

@NgModule({
  imports     : [
    CommonModule,
    SharedModule,
    NgxMatSelectSearchModule,
    PortalModule,
    MatRippleModule,
    ObserversModule,
    MatStepperModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FileUploadModule,
    OverlayModule,
    FormsModule,
    MonacoEditorModule,
    JsfDirectivesModule,
    JsfPipesModule
  ],
  declarations: [
    JsfErrorMessagesComponent,
    JsfOverlayComponent,
    JsfLoadingIndicatorComponent,
    JsfIconComponent,
    JsfInputComponent,
    JsfDropdownComponent,
    JsfButtonComponent,
    JsfChipListComponent,
    JsfFileUploadComponent,
    CodeEditorComponent,
    JsfBadgeComponent
  ],
  exports     : [
    JsfErrorMessagesComponent,
    JsfOverlayComponent,
    JsfLoadingIndicatorComponent,
    JsfIconComponent,
    JsfInputComponent,
    JsfDropdownComponent,
    JsfButtonComponent,
    JsfChipListComponent,
    JsfFileUploadComponent,
    CodeEditorComponent,
    JsfBadgeComponent
  ]
})
export class JsfCustomComponentsModule {}
