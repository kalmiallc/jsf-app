import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Bind,
  JsfBuilder,
  JsfBuilderOptions,
  JsfHandlerBuilderComponent,
  JsfPropBuilderObject,
  JsfPropLayoutBuilder
}                                                                       from '@kalmia/jsf-common-es2015';
import { AbstractPropHandlerComponent }                                 from '../../abstract/handler.component';

@Component({
  selector       : 'app-jsf-component',
  template       : `
      <div class="handler-component jsf-animatable"
           [ngClass]="layoutSchema?.htmlClass || ''">

          <jsf-kal-jsf-doc
                  *ngIf="jsfDefinition"
                  [doc]="jsfDefinition"
                  [builderOptions]="builderOptions"
                  [modes]="jsfBuilder.modes"
                  [debug]="jsfBuilder.debug"
                  [enableThemeRender]="false"
                  [innerScroll]="false"

                  [onFormBuilderCreated]="formBuilderCreated"
                  [onError]="jsfBuilder.onError"
                  [onFormEvent]="jsfBuilder.onFormEvent"
                  [onSubmit]="jsfBuilder.onSubmit"
                  [onCustomEvent]="jsfBuilder.onCustomEvent"
                  [onVirtualEvent]="jsfBuilder.onVirtualEvent"
                  [onNotification]="jsfBuilder.onNotification">
          </jsf-kal-jsf-doc>

      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class ComponentComponent extends AbstractPropHandlerComponent<JsfPropBuilderObject, JsfHandlerBuilderComponent> implements OnInit, OnDestroy {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderObject>;

  builderOptions: JsfBuilderOptions;

  get jsfDefinition() {
    return this.handlerBuilder.jsfComponentBuilder.jsfDefinition;
  }

  @Bind()
  public formBuilderCreated(builder: JsfBuilder) {
    this.handlerBuilder.initJsfComponent(builder);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.builderOptions = {
      ...this.jsfBuilder.options,
      jsfComponentBuilder: this.handlerBuilder.jsfComponentBuilder
    };

    const obs = this.handlerBuilder.jsfComponentBuilder
      .resolveJsfDefinition(this.handlerBuilder.builder.rootBuilder.jsfDefinitionProvider);
    if (obs) {
      obs.subscribe(() => {
        this.cdRef.detectChanges();
      });
    }
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.handlerBuilder.onLayoutDestroy();
  }
}
