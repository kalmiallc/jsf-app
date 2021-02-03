import { Directive, forwardRef, Input }                                             from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[modelValidator][ngModel],[modelValidator][ngFormControl]',
  providers: [{
    multi: true,
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ModelValidatorDirective)
  }]
})
export class ModelValidatorDirective implements Validator {

  constructor() { }

  @Input() modelValidator: ValidatorFn;

  validate(control: AbstractControl): ValidationErrors | null {
    return this.modelValidator(control);
  }

}
