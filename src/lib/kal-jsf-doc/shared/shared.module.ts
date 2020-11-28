import { NgModule }         from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule }            from '@angular/common';
import { ScrollingModule }         from '@angular/cdk/scrolling';
import { MomentDateModule }        from '@angular/material-moment-adapter';
import { MatToolbarModule }        from '@angular/material/toolbar';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  imports     : [
    CommonModule
  ],
  declarations: [],
  exports     : [
    MomentDateModule,

    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatStepperModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDialogModule,
    MatToolbarModule,

    ScrollingModule,
    OverlayscrollbarsModule
  ]
})
export class SharedModule {}
