import { isArray, isNull, isObject, isDate } from 'lodash';

export function mergeProps(objValue: any, srcValue: any, key: any, object: any, source: any, stack: any) {
  // Override default behaviour for array - do a full replace for these. Let the rest be handled by lodash.
  if (isArray(srcValue)) {
    return srcValue;
  }

  // Second special case is where the current and new value types do not match. In this case it's unclear how we want to merge, so just
  // return the new value instead.

  // tslint:disable:curly
  if (isArray(objValue) && !isArray(srcValue)) return srcValue;
  if (isObject(objValue) && !isObject(srcValue)) return srcValue;
  if (isDate(objValue) && !isDate(srcValue)) return srcValue;
  if (isNull(objValue) && !isNull(srcValue)) return srcValue;
  if (typeof objValue !== typeof srcValue) return srcValue;
}
