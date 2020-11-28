import { isI18nObject, JsfAbstractPropBuilder, JsfBuilder, JsfI18nObject } from '@kalmia/jsf-common-es2015';
import { FilterItemInterface }                                             from '../filter-item.interface';
import { EventEmitter, Input, Directive }                                             from '@angular/core';
import { KalJsfFilterMessages }                                            from '../kal-jsf-filter.messages';

@Directive()
export abstract class AbstractFilterPropComponent<JsfPropBuilder extends JsfAbstractPropBuilder<any, any, any, any>> {

  filterItem: FilterItemInterface;
  queryChange = new EventEmitter<any>();

  messages = KalJsfFilterMessages;

  public jsfBuilder: JsfBuilder;

  get translationServer() {
    return this.jsfBuilder.translationServer;
  }

  constructor() {
  }

  i18n(source: string | JsfI18nObject): string {
    const ts = this.translationServer;
    return ts ? ts.get(source) : (isI18nObject(source) ? source.val : source);
  }
}
