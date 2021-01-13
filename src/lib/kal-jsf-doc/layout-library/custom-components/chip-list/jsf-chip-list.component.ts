import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
}                                                                     from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl }         from '@angular/forms';
import { Overlay }                                                    from '@angular/cdk/overlay';
import { Subject }                                                    from 'rxjs';
import { JsfPropBuilder, JsfPropBuilderString, JsfPropLayoutBuilder } from '@kalmia/jsf-common-es2015';
import { ErrorStateMatcher }                                          from '@angular/material/core';
import { MatSelect, MatSelectChange }                                 from '@angular/material/select';
import * as OverlayScrollbars                                         from 'overlayscrollbars';
import { jsfDefaultScrollOptions }                                    from '../../../../utilities';
import { JSF_FORM_CONTROL_ERRORS }                                    from '../jsf-control-errors';
import { takeUntil }                                                  from 'rxjs/operators';
import { MatChipInputEvent }                                          from '@angular/material/chips';
import { ChipValue }           from '../../../../../../../../src/jsf-handlers/common/handlers/chip-list/app/chip-list.component';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';


@Component({
  selector       : 'jsf-chip-list',
  templateUrl    : './jsf-chip-list.component.html',
  styleUrls      : ['./jsf-chip-list.component.scss'],
  providers      : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsfChipListComponent),
      multi      : true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfChipListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  private _value: any[] = [];

  get value() {
    return this._value;
  }

  set value(x: any[]) {
    this._value = x;
    this.propagateChange(this._value);
  }

  private _control: NgControl;

  @Input() title?: string;
  @Input() description?: string;
  @Input() id?: string;
  @Input() notitle?: boolean;
  @Input() placeholder?: string;
  @Input() required?: boolean;
  @Input() disabled?: boolean;
  @Input() name?: string;
  @Input() readonly?: boolean;

  @Input() htmlClass?: string;
  @Input() color?: 'primary' | 'accent' | 'none'                   = 'primary';
  @Input() appearance?: 'legacy' | 'standard' | 'fill' | 'outline' = 'outline';
  @Input() variant?: 'small' | 'standard'                          = 'standard';

  @Input() selectable?: boolean;
  @Input() removable?: boolean;
  @Input() addOnBlur?: boolean;

  @Input() errorMap?: { [errorCode: string]: string };

  // Used internally by JSF
  @Input() layoutBuilder?: JsfPropLayoutBuilder<JsfPropBuilder>;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClick: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();


  get errors() {
    let errors = [];
    if (this.layoutBuilder) {
      errors = this.layoutBuilder.propBuilder.errors.map(x => x.interpolatedMessage);
    } else if (this._control) {
      for (const k of Object.keys(this._control.errors || {})) {
        if (!this._control.errors[k]) {
          continue;
        }

        let m: any;
        if (this.errorMap && this.errorMap[k]) {
          m = this.errorMap[k];
        } else if (this.defaultErrorMap[k]) {
          m = this.defaultErrorMap[k];
        } else {
          m = $localize`Field is invalid`;
        }

        errors.push(m(this._control.errors[k]));
      }
    }
    return errors;
  }

  private propagateChange = (_: any) => {};

  constructor(private cdRef: ChangeDetectorRef,
              private injector: Injector,
              @Inject(JSF_FORM_CONTROL_ERRORS) private defaultErrorMap,
              protected overlay: Overlay) { }

  ngOnInit(): void {
    this._control = this.injector.get(NgControl);

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.value = [...(this.value || []), value];
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.cdRef.detectChanges();
  }

  remove(chip: any): void {
    this.value = this.value.filter(x => x !== chip);
    this.cdRef.detectChanges();
  }


  trackByFn(index, item) {
    return item;
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: any): void {
  }

  public writeValue(obj: any): void {
    this._value = obj;
    this.cdRef.detectChanges();
  }


  isVariantStandard = () => this.variant === 'standard';
  isVariantSmall    = () => this.variant === 'small';
}
