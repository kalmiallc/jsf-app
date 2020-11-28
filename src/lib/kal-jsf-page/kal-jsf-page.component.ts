import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit
}                                         from '@angular/core';
import {
  Bind,
  isBindable,
  JsfBuilder,
  JsfBuilderOptions,
  JsfFormEventInterface,
  JsfNotificationInterface,
  ObjectID,
  JsfPage,
  JsfPageBuilder,
  JsfDefinition,
  DataSourceProviderRequestInterface,
  DataSourceProviderResponseInterface
}                                         from '@kalmia/jsf-common-es2015';
import { JSF_APP_CONFIG, JsfAppConfig }   from '../common';
import { Observable, Subject }            from 'rxjs';
import { BuilderDeveloperToolsInterface } from '../kal-jsf-doc/builder-developer-tools.interface';

@Component({
  selector       : 'jsf-page',
  templateUrl    : './kal-jsf-page.component.html',
  styleUrls      : ['./kal-jsf-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  pageBuilder?: JsfPageBuilder;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  // activeRequests: any = [];
  // /**
  //  * Array of active data source requests. Used for merging together requests with same data.
  //  */
  // dataSourceRequestActiveList: {
  //   req: DataSourceRequestInterface;
  //   observable: Observable<DataSourceResponseInterface>
  // }[] = [];

  /**
   * JSF page definition
   */
  @Input() pageDefinition?: JsfPage;

  /**
   * Proxy
   */
  @Input() proxy?: boolean;

  /**
   * Called when the application should load data source with specific filters
   */
  private _dataSourceProvider: (req: DataSourceProviderRequestInterface) => Observable<DataSourceProviderResponseInterface>;
  @Input()
  get dataSourceProvider() {
    return this._dataSourceProvider;
  }

  set dataSourceProvider(value: (req: DataSourceProviderRequestInterface) => Observable<DataSourceProviderResponseInterface>) {
    if (value && isBindable(value)) {
      throw new Error(`Provided method for 'dataSourceRequest' is not bound to parent context. Try using the @Bind() decorator.`);
    }
    this._dataSourceProvider = value;
  }

  /**
   * Data source configs that can be used by components to determine their behavior.
   * Content depends on the application implementation, normally this will be an array of data source configs.
   */
  @Input() dataSourceConfig: any;


  //////////////////////////////////////////////////////////////////////////////////////////////////
  /// JSF DOC FORWARD
  //////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Builder options
   */
  private _builderOptions: JsfBuilderOptions;
  get builderOptions(): JsfBuilderOptions {
    return this._builderOptions;
  }

  @Input()
  set builderOptions(opts: JsfBuilderOptions) {
    this._builderOptions = opts;
  }

  /**
   * Modes
   */
  private _modes: string[] = [];
  get modes(): string[] {
    return this._modes;
  }

  @Input()
  set modes(modes: string[]) {
    this._modes = modes;
  }

  /**
   * Whether the document should render its own theme.
   */
  @Input() enableThemeRender = false;

  /**
   * Set to true to disable theme's wrapper styles.
   */
  @Input() disableWrapperStyles?: boolean;

  /**
   * Flag to override the loading indicator display.
   */
  @Input() showLoadingIndicator?: boolean;

  /**
   * Developer tools options for visual jsf builder for jsf builder.
   */
  @Input() developerTools?: BuilderDeveloperToolsInterface;

  @Input() jsfDefinitionProvider?: (key: string) => Observable<JsfDefinition>;

  /**
   * Called when a custom event is triggered.
   * The function should throw an error if the operation failed.
   */
  private _onFormEvent: (data: JsfFormEventInterface) => Promise<any>;

  @Input()
  get onFormEvent(): (data: JsfFormEventInterface) => Promise<any> {
    return this._onFormEvent;
  }

  set onFormEvent(value: (data: JsfFormEventInterface) => Promise<any>) {
    this._onFormEvent = value;
  }

  /**
   * Called when the application should trigger a custom event.
   * Function should return the result of the custom event API call, or throw an error if the operation failed.
   */
  private _onCustomEvent: (eventName: string, eventData: any, documentId?: string | ObjectID) => Promise<any>;
  @Input()
  get onCustomEvent(): (eventName: string, eventData: any, documentId?: string | ObjectID) => Promise<any> {
    return this._onCustomEvent;
  }

  set onCustomEvent(value: (eventName: string, eventData: any, documentId?: string | ObjectID) => Promise<any>) {
    this._onCustomEvent = value;
  }

  /**
   * Called when the application should trigger a virtual event.
   * Function should return the result of the virtual event API call, or throw an error if the operation failed.
   */
  private _onVirtualEvent: (eventName: string, eventData: any) => Promise<any>;
  @Input()
  get onVirtualEvent(): (eventName: string, eventData: any) => Promise<any> {
    return this._onVirtualEvent;
  }

  set onVirtualEvent(value: (eventName: string, eventData: any) => Promise<any>) {
    this._onVirtualEvent = value;
  }


  /**
   * Called when the application should display a notification.
   */
  private _onNotification: (notification: JsfNotificationInterface) => Promise<any>;
  @Input()
  get onNotification(): (notification: JsfNotificationInterface) => Promise<any> {
    return this._onNotification;
  }

  set onNotification(value: (notification: JsfNotificationInterface) => Promise<any>) {
    this._onNotification = value;
  }

  /**
   * Called when form instance is built.
   */
  private _onFormBuilderCreated: (formBuilder: JsfBuilder) => Promise<void>;
  @Input()
  get onFormBuilderCreated(): (formBuilder: JsfBuilder) => Promise<void> {
    return this._onFormBuilderCreated;
  }

  set onFormBuilderCreated(value: (formBuilder: JsfBuilder) => Promise<void>) {
    if (value && isBindable(value)) {
      throw new Error(`Provided method for 'onFormBuilderCreated' is not bound to parent context. Try using the @Bind() decorator.`);
    }
    this._onFormBuilderCreated = value;
  }

  /**
   * Called when an error occurs in the component.
   */
  private _onError: (e: any) => Promise<void>;
  @Input()
  get onError(): (e: any) => Promise<void> {
    return this._onError;
  }

  set onError(value: (e: any) => Promise<void>) {
    if (value && isBindable(value)) {
      throw new Error(`Provided method for 'onError' is not bound to parent context. Try using the @Bind() decorator.`);
    }
    this._onError = value;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /// JSF DOC FORWARD <END>
  //////////////////////////////////////////////////////////////////////////////////////////////////


  constructor(
    private cdRef: ChangeDetectorRef,
    @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig) {
  }

  ngOnInit() {
    if (!this.pageBuilder) {
      if (!this.pageDefinition) {
        throw new Error('[JSF-PAGE] Input pageBuilder or pageDefinition is required.');
      }
      this.pageBuilder = new JsfPageBuilder(this.pageDefinition, {
        dataSourceProvider: this.dataSourceProvider,
        dataSourceConfig: this.dataSourceConfig,
        jsfDefinitionProvider: this.jsfDefinitionProvider,
      });
    }

    if (!this.jsfDefinitionProvider) {
      this.jsfDefinitionProvider = this.pageBuilder.jsfDefinitionProvider;
    }

    (window as any).__jsfPage                      = (window as any).__jsfPage || {};
    (window as any).__jsfPage[this.pageBuilder.id] = this.pageBuilder;

    const obs = this.pageBuilder.rootComponent.resolveJsfDefinition(this.jsfDefinitionProvider);
    if (obs) {
      obs.subscribe(() => {
        this.cdRef.detectChanges();
      });
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    (window as any).__jsfPage[this.pageBuilder.id] = void 0;
  }

  onComponentJsfErrorCallback(componentKey: string) {
    return this.onComponentJsfError.bind(this, componentKey);
  }

  onComponentJsfError(componentKey: string, error: any) {
    console.error('[JSF-PAGE] Component Jsf Error ' + componentKey, { error });
    console.error(error);
  }

  onComponentJsfBuilderCreateCallback(componentKey: string) {
    return this.onComponentJsfBuilderCreate.bind(this, componentKey);
  }

  onComponentJsfBuilderCreate(componentKey: string, jsfBuilder: JsfBuilder) {
    console.log('[JSF-DASH] Component JsfBuilder Create ' + componentKey, { jsfBuilder });
    this.pageBuilder.registerRootComponent(jsfBuilder);

    if (componentKey === '' && this.onFormBuilderCreated) {
      return this.onFormBuilderCreated(jsfBuilder);
    }
  }

  @Bind()
  async onFormEventInterceptor($event) {
    return Promise.all([this.onFormEventHook($event), this.onFormEvent && this.onFormEvent($event)]);
  }

  private onFormEventHook(data: JsfFormEventInterface): Promise<any> {
    return null;
  }
}
