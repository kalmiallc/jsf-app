import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Optional,
  Output
}                                                                                                               from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import {
  Bind,
  JsfBuilder,
  JsfDocument,
  JsfFormEventInterface,
  PropStatus
}                                                                                                               from '@kalmia/jsf-common-es2015';
import { Subject }                                                                                              from 'rxjs';
import { takeUntil }                                                                                            from 'rxjs/operators';
import {
  ControlValidationState,
  ShowValidationMessagesDirective
}                                                                                                               from '../kal-jsf-doc/directives/show-validation-messages.directive';
import { JsfErrorStateMatcher }                                                                                 from '../utilities';

@Component({
  selector       : 'jsf-kal-jsf-form-control',
  templateUrl    : './kal-jsf-form-control.component.html',
  styleUrls      : ['./kal-jsf-form-control.component.scss'],
  exportAs       : 'kalJsfFormControl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KalJsfFormControlComponent),
      multi      : true
    },
    {
      provide    : NG_VALIDATORS,
      useExisting: forwardRef(() => KalJsfFormControlComponent),
      multi      : true
    }
  ]
})
export class KalJsfFormControlComponent implements OnDestroy, ControlValueAccessor, Validator, ControlValidationState {

  @Input()
  public doc: JsfDocument;

  @Output()
  public formEvent: EventEmitter<JsfFormEventInterface> = new EventEmitter<JsfFormEventInterface>();


  private builder: JsfBuilder;
  private _showValidationErrors: boolean;

  get showValidationErrors() {
    return this._showValidationErrors;
  }


  /**
   * Internal.
   */
  private value: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private errorStateMatcher: JsfErrorStateMatcher;

  public touched: boolean;
  public dirty: boolean;

  get invalid() {
    return this.builder.propBuilder.invalid;
  }

  private propagateValueChange     = (_: any) => {};
  private propagateValidatorChange = () => {};


  constructor(private cdRef: ChangeDetectorRef,
              @Optional() public showValidation: ShowValidationMessagesDirective) {
    this.errorStateMatcher = new JsfErrorStateMatcher(showValidation);

    if (showValidation) {
      showValidation.registerChildControlValidationState(this);
    }

    if (this.showValidation) {
      this.showValidation.state$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(x => {
          this._showValidationErrors = x;
          this.cdRef.detectChanges();
        });
    }
  }


  /**
   * Lifecycle hooks.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Handlers.
   */
  @Bind()
  noopHandler() {}

  @Bind()
  async onFormBuilderCreatedHandler(builder: JsfBuilder) {
    this.builder = builder;

    // Merge the current value (which may have been set by ngModel) with the builder value.
    if (this.value !== undefined) {
      await this.builder.patchJsonValue(this.value);
    }

    // Update the internal value with whatever the current builder state is and propagate it outwards.
    this.value = this.builder.getJsonValue();
    this.updateFormBuilderValue();

    this.propagateValueChange(this.value);
    this.propagateValidatorChange();

    this.builder.statusChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(status => {
        if (status !== PropStatus.Pending) {
          this.propagateValueChange(this.builder.getJsonValue());
          this.touched = true;
          this.dirty   = true;
        }
      });
  }

  @Bind()
  onFormEventHandler(event: JsfFormEventInterface) {
    return this.formEvent.emit(event);
  }

  @Bind()
  onErrorHandler(error: any) {
    throw error;
  }

  private updateFormBuilderValue() {
    if (this.builder && this.value !== undefined) {
      this.builder.setJsonValue(this.value).catch(console.error);
    }
  }

  /**
   * Control value accessor impl.
   */
  public registerOnChange(fn: any): void {
    this.propagateValueChange = fn;
  }

  public registerOnTouched(fn: any): void {
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.propagateValidatorChange = fn;
  }

  public writeValue(value: any): void {
    this.value = value;
    this.updateFormBuilderValue();
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (this.builder && this.invalid) {
      return { 'invalid': true };
    }
  }
}
