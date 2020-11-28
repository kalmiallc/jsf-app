import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractLayoutBuilderComponent }     from './abstract-layout-builder.component';
import { JsfRegister }                        from '@kalmia/jsf-common-es2015';

@Component({
  template       : '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbstractPropHandlerLayoutBuilderComponent extends AbstractLayoutBuilderComponent {

  get prop() {
    return this.layoutEditor.jsfEditor.getProp(this.layoutEditor.mutableDefinition.key);
  }

  get handlerCompatibilityInfo() {
    return JsfRegister.getHandlerCompatibilityOrThrow(this.prop.handlerType);
  }

}
