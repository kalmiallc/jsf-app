import { InjectionToken } from '@angular/core';

export const jsfControlErrors = {
  required : (error) => $localize`Required`,
  minlength: ({ requiredLength, actualLength }) => $localize`Minimum length is ${ requiredLength }`
};

export const JSF_FORM_CONTROL_ERRORS = new InjectionToken('JSF_CONTROL_ERRORS', {
  providedIn: 'root',
  factory   : () => jsfControlErrors
});
