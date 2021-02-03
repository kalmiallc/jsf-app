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
  Output, ViewChild
}                                                             from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { Overlay }                                            from '@angular/cdk/overlay';
import { Subject }                                            from 'rxjs';
import { JsfFormat, JsfPropBuilder, JsfPropLayoutBuilder }    from '@kalmia/jsf-common-es2015';
import { ErrorStateMatcher }                                  from '@angular/material/core';
import { isBoolean }                                          from 'lodash';
import { JSF_FORM_CONTROL_ERRORS }                            from '../jsf-control-errors';
import * as BigJs                                             from 'big.js';
import { MatInput }                                           from '@angular/material/input';


@Component({
  selector       : 'jsf-input',
  templateUrl    : './jsf-input.component.html',
  styleUrls      : ['./jsf-input.component.scss'],
  providers      : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsfInputComponent),
      multi      : true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private _value: string | number | Date;

  get value() {
    return this._value;
  }

  set value(x: string | number | Date) {
    this._value = x;
    this.propagateChange(this._value);
  }

  private _control: NgControl;

  @ViewChild(MatInput, { static: false })
  matInputControl: MatInput;

  @Input() type: 'string' | 'number' | 'integer' | 'date' = 'string';
  @Input() multiline?: boolean;

  @Input() title?: string;
  @Input() description?: string;
  @Input() id?: string;
  @Input() notitle?: boolean;
  @Input() placeholder?: string;
  @Input() required?: boolean;
  @Input() disabled?: boolean;
  @Input() name?: string;
  @Input() readonly?: boolean;
  @Input() secret?: boolean;
  @Input() format?: JsfFormat;
  @Input() step?: number;
  @Input() minimum?: number | Date;
  @Input() maximum?: number | Date;
  @Input() minDecimalDigits?: number;
  @Input() maxDecimalDigits?: number;
  @Input() stepperButtons?: boolean;

  @Input() htmlClass?: string;
  @Input() color?: 'primary' | 'accent' | 'none'                   = 'primary';
  @Input() appearance?: 'legacy' | 'standard' | 'fill' | 'outline' = 'outline';
  @Input() variant?: 'small' | 'standard'                          = 'standard';

  @Input() prefixIcon?: string;
  @Input() prefixLabel?: string;
  @Input() suffixIcon?: string;
  @Input() suffixLabel?: string;
  @Input() clearable?: boolean;

  @Input() errorMap?: { [errorCode: string]: any };

  // Used internally by JSF
  @Input() layoutBuilder?: JsfPropLayoutBuilder<JsfPropBuilder>;
  @Input() errorStateMatcher?: ErrorStateMatcher;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();


  get inputType(): string {
    if (this.secret) {
      return 'password';
    }

    switch (this.format) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'color':
        return 'color';
      case 'uri':
        return 'url';
      case 'time':
        return 'time';
      case 'date-time':
        return 'datetime-local';
      default:
        return 'text';
    }
  }

  get rows() {
    if (isBoolean(this.multiline)) {
      return this.multiline ? 2 : 1;
    }
    return +this.multiline;
  }

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

  increment() {
    let x = + (new BigJs.Big(<number>this.value || 0)
      .plus(this.step)
      .toPrecision());

    if (this.maximum !== undefined) {
      x = Math.min(x, <number>this.maximum);
    }
    this.value = x;
    this.markMaterialControlAsDirty();
  }

  decrement() {
    let x = + (new BigJs.Big(<number>this.value || 0)
      .minus(this.step)
      .toPrecision());

    if (this.minimum !== undefined) {
      x = Math.max(x, <number>this.minimum);
    }
    this.value = x;
    this.markMaterialControlAsDirty();
  }

  private markMaterialControlAsDirty() {
    if (this.matInputControl) {
      const ngControl = this.matInputControl.ngControl;
      if (ngControl && ngControl.control) {
        ngControl.control.markAsDirty();
      }
    }
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
  isMultiline       = () => this.multiline;
}
