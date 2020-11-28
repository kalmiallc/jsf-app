import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  Injector,
  Input,
  NgModuleFactory,
  NgModuleFactoryLoader,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
}                                                      from '@angular/core';
import { JsfPropLayoutBuilder, JsfUnknownPropBuilder } from '@kalmia/jsf-common-es2015';
import { RouterComponent }                             from './router.component';
import { pascalcase }                                  from '../../utilities';
import { BuilderDeveloperToolsInterface }              from '../builder-developer-tools.interface';
import { Subject }                                     from 'rxjs';
import { PropStringComponent }                         from '../prop-library/string.component';
import { PropNumberComponent }                         from '../prop-library/number.component';
import { PropIntegerComponent }                        from '../prop-library/integer.component';
import { PropBinaryComponent }                         from '../prop-library/binary.component';
import { PropBooleanComponent }                        from '../prop-library/boolean.component';
import { PropDateComponent }                           from '../prop-library/date.component';
import { PropObjectComponent }                         from '../prop-library/object.component';
import { PropRefComponent }                            from '../prop-library/ref.component';
import { PropIdComponent }                             from '../prop-library/id.component';
import { PropArrayComponent }                          from '../prop-library/array.component';
import { PropTableComponent }                          from '../prop-library/table.component';
import { PropExpansionPanelComponent }                 from '../prop-library/expansion-panel.component';
import { AbstractPropLayoutComponent }                 from '../abstract/prop-layout.component';
import { ComponentComponent }                          from '../handlers/component/component.component';
import { AnyComponent }                                from '../handlers/any/any.component';


const componentList = {
  'string' : PropStringComponent,
  'number' : PropNumberComponent,
  'integer': PropIntegerComponent,
  'binary' : PropBinaryComponent,
  'boolean': PropBooleanComponent,
  'date'   : PropDateComponent,
  'object' : PropObjectComponent,
  'ref'    : PropRefComponent,
  'id'     : PropIdComponent
};

const arrayComponentList = {
  'array'          : PropArrayComponent,
  'table'          : PropTableComponent,
  'expansion-panel': PropExpansionPanelComponent
};

@Component({
  selector       : 'jsf-prop-router',
  template       : `
      <ng-container #routerOutlet></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropRouterComponent extends RouterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @HostBinding('attr.jsf-prop-id')
  idAttr;

  @ViewChild('routerOutlet', { read: ViewContainerRef, static: true })
  private routerOutlet: ViewContainerRef;

  // Reference to the created prop component.
  private componentRef: ComponentRef<AbstractPropLayoutComponent<JsfUnknownPropBuilder>>;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  get layoutType(): string {
    return this.layoutBuilder.layout.type;
  }

  get debug() {
    return this.layoutBuilder && this.layoutBuilder.rootBuilder && this.layoutBuilder.rootBuilder.debug;
  }

  get propBuilder() {
    return this.layoutBuilder.propBuilder;
  }

  constructor(private loader: NgModuleFactoryLoader,
              private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector,
              private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.idAttr = this.propBuilder.id;
  }

  /**
   * Destroy.
   */
  ngOnDestroy(): void {
    // Detach change detector.
    this.cdRef.detach();

    // Unsubscribe from all observables.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      try {
        this.createComponent();
      } catch (e) {
        console.error(e); // TODO
      }
    }, 0);
  }

  private createComponent() {
    const vcRef = this.routerOutlet;

    const propType = this.layoutBuilder.propBuilder.prop.type as string;
    if (this.layoutBuilder.propBuilder.prop.handler && this.layoutBuilder.propBuilder.prop.handler.type) {
      // Render custom handler
      this.renderCustomHandler(vcRef).catch(console.error);
    } else {
      // Render built-in prop
      const component = propType === 'array' ? arrayComponentList[this.layoutType] : componentList[propType];
      if (!component) {
        throw new Error(`Unknown prop ${ JSON.stringify(propType) }`);
      }

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory<AbstractPropLayoutComponent<JsfUnknownPropBuilder>>(component);

      vcRef.clear();
      this.componentRef = vcRef.createComponent(componentFactory);

      // Set inputs
      this.componentRef.instance.layoutBuilder = this.layoutBuilder;
    }

    // Run change detection
    this.componentRef.changeDetectorRef.detectChanges();
  }


  private async renderCustomHandler(container: ViewContainerRef) {
    if (!container) {
      return;
    }

    container.clear();

    const handlerPath = this.layoutBuilder.propBuilder.prop.handler && this.layoutBuilder.propBuilder.prop.handler.type;
    if (!handlerPath) {
      throw new Error(`Handler path not found.`);
    }

    // Special case for internal handler type
    switch (handlerPath) {
      case 'any': {
        const compFactory = this.componentFactoryResolver.resolveComponentFactory(AnyComponent);
        return this.createHandlerComponent(container, compFactory);
      }
      case 'component': {
        const compFactory = this.componentFactoryResolver.resolveComponentFactory(ComponentComponent);
        return this.createHandlerComponent(container, compFactory);
      }
    }

    // Use cached module factory if it exists.
    const cachedModules = this.layoutBuilder.rootBuilder.cachedModules || {};
    if (cachedModules[handlerPath]) {
      if (this.debug) {
        console.log(`Using preloaded module '${ handlerPath }'`);
      }

      return this.createHandlerFromModuleFactory(container, cachedModules[handlerPath]);
    }

    // NOTE: bottom code theoretically should never be called.
    console.error(`NOTICE: this is not a bug, please report this usage case to developers. This piece of code should never be called!`);

    // No preloaded module found, create the module factory now.
    const jsfHandlersPath = this.layoutBuilder.rootBuilder.jsfHandlersPath;
    const pathTokens      = handlerPath.split('/');
    if (pathTokens.length !== 2) {
      throw new Error(`Invalid handler module name format: ${ handlerPath }`);
    }

    const handlerCategory = pathTokens[0];
    const handlerName     = pathTokens[1];
    // tslint:disable-next-line
    const modulePath      = `${ jsfHandlersPath }${ handlerCategory }/handlers/${ handlerName }/app/${ handlerName }.module.ts#${ pascalcase(handlerName) }Module`;

    if (this.layoutBuilder.rootBuilder.warnings) {
      console.warn(`Prop '${ this.layoutType }' handler module '${ modulePath }' not found in module cache.`);
    }

    try {
      const moduleFactory: NgModuleFactory<any> = await this.loader.load(modulePath);
      // Insert module into cache
      cachedModules[handlerPath]                = moduleFactory;

      return this.createHandlerFromModuleFactory(container, moduleFactory);
    } catch (e) {
      // Rethrow error
      throw e;
    }
  }

  private createHandlerFromModuleFactory(container: ViewContainerRef, moduleFactory: NgModuleFactory<any>) {
    let compFactory;

    if (!moduleFactory.moduleType) {
      compFactory    = this.componentFactoryResolver.resolveComponentFactory((moduleFactory as any).entryComponent);
      return this.createHandlerComponent(container, compFactory);
    } else {
      // Load main entry component from module
      const entryComponent = (<any>moduleFactory.moduleType).entryComponent;
      const moduleRef      = moduleFactory.create(this.injector);
      compFactory    = moduleRef.componentFactoryResolver.resolveComponentFactory<AbstractPropLayoutComponent<JsfUnknownPropBuilder>>(entryComponent);
    }

    return this.createHandlerComponent(container, compFactory);
  }

  private createHandlerComponent(container: ViewContainerRef, componentFactory: ComponentFactory<any>) {
    this.componentRef = container.createComponent(componentFactory);

    // Set input values
    this.componentRef.instance.layoutBuilder = this.layoutBuilder;
  }
}
