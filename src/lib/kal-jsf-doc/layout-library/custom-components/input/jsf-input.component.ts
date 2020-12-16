import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output
}                                                             from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { Overlay }                                            from '@angular/cdk/overlay';
import { Subject }                                            from 'rxjs';
import { JsfFormat, JsfPropBuilder, JsfPropLayoutBuilder }    from '@kalmia/jsf-common-es2015';
import { ErrorStateMatcher }                                  from '@angular/material/core';
import { isBoolean }                                          from 'lodash';


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

  private _value: string;

  get value() {
    return this._value;
  }

  set value(x: string) {
    this._value = x;
    this.propagateChange(this._value);
  }

  private _control: NgControl;

  @Input() type: 'string' | 'number' = 'string';
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

  @Input() htmlClass?: string;
  @Input() color?: 'primary' | 'accent' | 'none' = 'primary';
  @Input() appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  @Input() variant?: 'small' | 'standard'        = 'standard';

  @Input() prefixIcon?: string;
  @Input() prefixLabel?: string;
  @Input() suffixIcon?: string;
  @Input() suffixLabel?: string;
  @Input() clearable?: boolean;

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
        errors.push(this._control.errors[k]);
      }
    }
    return errors;
  }

  private propagateChange = (_: any) => {};

  constructor(private cdRef: ChangeDetectorRef,
              private injector: Injector,
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
