import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  SecurityContext
}                                         from '@angular/core';
import {
  Bind,
  JsfBuilder,
  JsfBuilderOptions, JsfComponentBuilder, JsfDefinition,
  JsfDocument,
  JsfFormEventInterface,
  JsfNotificationInterface,
  LayoutMode,
  ObjectID
} from '@kalmia/jsf-common-es2015';
import {
  interval, Observable,
  Subject
} from 'rxjs';
import { BuilderDeveloperToolsInterface } from '../kal-jsf-doc/builder-developer-tools.interface';
import {
  FrameEvent,
  KalJsfProxyFrameDocComponent
}                                         from './kal-jsf-proxy-frame-doc.component';
import { isEqual }                        from 'lodash';
import {
  filter,
  map,
  take,
  takeUntil
}                                         from 'rxjs/operators';
import { APP_BASE_HREF }                  from '@angular/common';
import {
  DomSanitizer,
  SafeResourceUrl
}                                         from '@angular/platform-browser';


// tslint:disable:no-output-on-prefix

@Component({
  selector       : 'jsf-kal-jsf-proxy-doc',
  template       : `
      <iframe *ngIf="iframeUrl" [attr.src]="iframeUrl" (load)="onIFrameLoad(iframe)" #iframe></iframe>
  `,
  styles         : [
      `
          iframe {
              border:   0;
              width:    100%;
              height:   100%;

              /* Fix Chrome bug where the iframe will sometimes render completely white. */
              position: relative;
          }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfProxyDocComponent implements OnInit, AfterViewInit, OnDestroy {

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private frame: HTMLIFrameElement;
  private frameWindow: Window;
  private componentRef: KalJsfProxyFrameDocComponent;

  private get componentRefZone(): NgZone {
    return this.componentRef.zone;
  }

  public iframeUrl: SafeResourceUrl;


  /**************************************
   * JSF doc inputs
   **************************************/

  /**
   * Doc
   */
  private _doc: JsfDocument;
  @Input()
  get doc(): JsfDocument { return this._doc; }

  set doc(value: JsfDocument) {
    this._doc = value;
    this.update();
  }

  /**
   * Builder options
   */
  private _builderOptions: JsfBuilderOptions;
  @Input()
  get builderOptions(): JsfBuilderOptions { return this._builderOptions; }

  set builderOptions(opts: JsfBuilderOptions) {
    this._builderOptions = opts;
    this.update();
  }

  /**
   * Modes
   */
  private _modes: string[] = [
    // Use reasonable defaults
    LayoutMode.New
  ];
  @Input()
  get modes(): string[] { return this._modes; }

  set modes(modes: string[]) {
    this._modes = modes;
    this.update();
  }

  /**
   * Debug
   */
  private _debug?: boolean;
  @Input()
  get debug(): boolean { return this._debug; }

  set debug(value: boolean | undefined) {
    this._debug = value;
    this.update();
  }

  /**
   * Whether the document should render its own theme.
   */
  private _enableThemeRender = false;
  @Input()
  public get enableThemeRender(): boolean {
    return this._enableThemeRender;
  }

  public set enableThemeRender(value: boolean) {
    this._enableThemeRender = value;
    this.update();
  }

  /**
   * Whether the theme should handle the form scrolling, instead of the component parent.
   */
  private _innerScroll?: boolean;
  @Input()
  public get innerScroll(): boolean {
    return this._innerScroll;
  }

  public set innerScroll(value: boolean) {
    this._innerScroll = value;
    this.update();
  }

  /**
   * Set to true to disable theme's wrapper styles.
   */
  private _disableWrapperStyles?: boolean;
  @Input()
  public get disableWrapperStyles(): boolean {
    return this._disableWrapperStyles;
  }

  public set disableWrapperStyles(value: boolean) {
    this._disableWrapperStyles = value;
    this.update();
  }

  /**
   * Flag to override the loading indicator display.
   */
  private _showLoadingIndicator?: boolean;
  @Input()
  public get showLoadingIndicator(): boolean {
    return this._showLoadingIndicator;
  }

  public set showLoadingIndicator(value: boolean) {
    this._showLoadingIndicator = value;
    this.update();
  }

  /**
   * Developer tools options for visual jsf builder for jsf builder.
   */
  private _developerTools?: BuilderDeveloperToolsInterface;
  @Input()
  public get developerTools(): BuilderDeveloperToolsInterface {
    return this._developerTools;
  }

  public set developerTools(value: BuilderDeveloperToolsInterface) {
    this._developerTools = value;
    this.update();
  }


  private _showValidationErrors?: boolean;
  @Input()
  get showValidationErrors(): boolean {
    return this._showValidationErrors;
  }

  set showValidationErrors(value: boolean) {
    this._showValidationErrors = value;
    this.update();
  }


  /**
   * A builder instance to link this form builder to. This is useful to for example run onClick events on a different
   * form.
   */
  private _linkedFormBuilder?: JsfBuilder;
  @Input()
  get linkedFormBuilder(): JsfBuilder {
    return this._linkedFormBuilder;
  }

  set linkedFormBuilder(value: JsfBuilder) {
    this._linkedFormBuilder = value;
    this.update();
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
    this._onFormBuilderCreated = (function (formBuilder: JsfBuilder) { return this.zone.run(() => value(formBuilder)); }).bind(this);
    this.update();
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
    this._onError = (function (e: any) { return this.zone.run(() => value(e)); }).bind(this);
    this.update();
  }

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
    this._onFormEvent = (function (data: JsfFormEventInterface) { return this.zone.run(() => value(data)); }).bind(this);
    this.update();
  }

  /**
   * Called when form value changes.
   */
  private _onValueChange: (value: any) => Promise<any>;
  @Input()
  get onValueChange(): (value: any) => Promise<any> {
    return this._onValueChange;
  }

  set onValueChange(value: (data: any) => Promise<any>) {
    this._onValueChange = (function (data: any) { return this.zone.run(() => value(data)); }).bind(this);
    this.update();
  }

  /**
   * Called when form is submitted.
   * The function should throw an error if the operation failed.
   */
  private _onSubmit: () => Promise<any>;
  @Input()
  get onSubmit(): () => Promise<any> {
    return this._onSubmit;
  }

  set onSubmit(value: () => Promise<any>) {
    this._onSubmit = (function () { return this.zone.run(() => value()); }).bind(this);
    this.update();
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
    this._onCustomEvent = (function (eventName: string, eventData: any, documentId?: string | ObjectID) { return this.zone.run(() => value(eventName, eventData, documentId)); }).bind(this);
    this.update();
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
    this._onVirtualEvent = (function (eventName: string, eventData: any) { return this.zone.run(() => value(eventName, eventData)); }).bind(this);
    this.update();
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
    this._onNotification = (function (notification: JsfNotificationInterface) { return this.zone.run(() => value(notification)); }).bind(this);
    this.update();
  }

  private _jsfDefinitionProvider?: (key: string) => Observable<JsfDefinition>;
  get jsfDefinitionProvider(): (key: string) => Observable<JsfDefinition> {
    return this._jsfDefinitionProvider;
  }

  @Input()
  set jsfDefinitionProvider(value: (key: string) => Observable<JsfDefinition>) {
    this._jsfDefinitionProvider = (function (key: string) { return this.zone.run(() => value(key)); }).bind(this);
    this.update();
  }

  private _jsfComponentBuilder?: JsfComponentBuilder;
  get jsfComponentBuilder(): JsfComponentBuilder {
    return this._jsfComponentBuilder;
  }

  @Input()
  set jsfComponentBuilder(value: JsfComponentBuilder) {
    this._jsfComponentBuilder = value;
    this.update();
  }

  /**************************************
   * Component logic
   **************************************/

  constructor(private zone: NgZone,
              private sanitizer: DomSanitizer,
              @Optional() @Inject(APP_BASE_HREF) baseHref: string) {

    this.iframeUrl = sanitizer.bypassSecurityTrustResourceUrl(`${ baseHref || '' }__jsf-proxy`);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    // Safety check - iframe may not be created before this component is destroyed
    if (!this.componentRef) {
      return;
    }

    this.componentRefZone.run(() => {
      this.componentRef.disconnect();
    });
  }


  onIFrameLoad(iframe: HTMLIFrameElement) {
    this.frame       = iframe;
    this.frameWindow = iframe.contentWindow;

    interval(50)
      .pipe(map(() => (this.frameWindow as any)['__JSF_PROXY_FRAME__']))
      .pipe(filter(x => !!x))
      .pipe(take(1))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(componentRef => {
        this.componentRef = componentRef;
        console.log(`[KalJsfProxyDocComponent] Frame loaded`);

        this.update();
        this.observe();
        this.markFrameReady();
      });
  }

  update() {
    if (!this.componentRef) {
      return;
    }
    console.log(`[KalJsfProxyDocComponent] Updating input values`);

    // Hardcoded values to ensure proper rendering of the component
    this.updateComponentRefProperty('enableThemeRender', this.enableThemeRender);
    this.updateComponentRefProperty('innerScroll', this.innerScroll);
    this.updateComponentRefProperty('modes', [
      ...this.modes,
      LayoutMode.Embedded
    ]);

    // Map inputs
    this.updateComponentRefProperty('doc', this.doc);
    this.updateComponentRefProperty('builderOptions', this.builderOptions);
    this.updateComponentRefProperty('debug', this.debug);
    this.updateComponentRefProperty('disableWrapperStyles', this.disableWrapperStyles);
    this.updateComponentRefProperty('showLoadingIndicator', this.showLoadingIndicator);
    this.updateComponentRefProperty('developerTools', this.developerTools);
    this.updateComponentRefProperty('showValidationErrors', this.showValidationErrors);
    this.updateComponentRefProperty('linkedFormBuilder', this.linkedFormBuilder);

    this.updateComponentRefProperty('onFormBuilderCreated', this.onFormBuilderCreated);
    this.updateComponentRefProperty('onError', this.onError);
    this.updateComponentRefProperty('onFormEvent', this.onFormEvent);
    this.updateComponentRefProperty('onValueChange', this.onValueChange);
    this.updateComponentRefProperty('onSubmit', this.onSubmit);
    this.updateComponentRefProperty('onCustomEvent', this.onCustomEvent);
    this.updateComponentRefProperty('onVirtualEvent', this.onVirtualEvent);
    this.updateComponentRefProperty('onNotification', this.onNotification);

    this.updateComponentRefProperty('jsfDefinitionProvider', this.jsfDefinitionProvider);
    this.updateComponentRefProperty('jsfComponentBuilder', this.jsfComponentBuilder);

    this.componentRefZone.run(() => {
      this.componentRef.detectChanges();
    });
  }

  private updateComponentRefProperty(propertyName, value) {
    // Only update component value if there was a change, to prevent the form from reconstructing.
    if (!isEqual(this.componentRef[propertyName], value)) {
      this.componentRefZone.run(() => {
        this.componentRef[propertyName] = value;
      });
    }
  }

  observe() {
    if (!this.innerScroll) {
      this.componentRefZone.run(() => {
        this.componentRef.registerOnEventFn(this.onFrameEvent);
        this.componentRef.observe();
      });
    }
  }

  markFrameReady() {
    console.log(`[KalJsfProxyDocComponent] Marked ready`);

    this.componentRefZone.run(() => {
      this.componentRef.ready = true;
      this.componentRef.detectChanges();
    });
  }

  @Bind()
  private onFrameEvent(event: FrameEvent) {
    switch (event.type) {
      case 'resize':
        this.frame.style.height = `${ event.data.height }px`;
        break;
    }
  }
}
