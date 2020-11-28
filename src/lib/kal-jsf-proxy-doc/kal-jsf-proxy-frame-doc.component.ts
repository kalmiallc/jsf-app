import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import {
  JsfBuilder,
  JsfBuilderOptions, JsfComponentBuilder, JsfDefinition,
  JsfDocument,
  JsfFormEventInterface,
  JsfNotificationInterface,
  ObjectID
} from '@kalmia/jsf-common-es2015';
import { Observable, Subject }                      from 'rxjs';
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import { BuilderDeveloperToolsInterface }                                                          from '../kal-jsf-doc/builder-developer-tools.interface';

interface ResizeObserverInterface {
  observe(target: HTMLElement, options?: { box: 'content-box' | 'border-box' });

  unobserve(target: HTMLElement);

  disconnect();
}

export interface FrameEvent {
  type: 'resize';
  data: any; // Event-specific data
}

// Use polyfilled ResizeObserver if native browser version is not present.
const ResizeObserver = (window as any).ResizeObserver || ResizeObserverPolyfill;

// tslint:disable:no-output-on-prefix
@Component({
  selector       : 'jsf-kal-jsf-proxy-frame-doc',
  template       : `
      <jsf-kal-jsf-doc *ngIf="ready"
                       [doc]="doc"
                       [builderOptions]="builderOptions"
                       [modes]="modes"
                       [debug]="debug"
                       [enableThemeRender]="enableThemeRender"
                       [innerScroll]="innerScroll"
                       [disableWrapperStyles]="disableWrapperStyles"
                       [showLoadingIndicator]="showLoadingIndicator"
                       [developerTools]="developerTools"
                       [showValidationErrors]="showValidationErrors"
                       [linkedFormBuilder]="linkedFormBuilder"

                       [onFormBuilderCreated]="onFormBuilderCreated"
                       [onError]="onError"
                       [onFormEvent]="onFormEvent"
                       [onValueChange]="onValueChange"
                       [onSubmit]="onSubmit"
                       [onCustomEvent]="onCustomEvent"
                       [onVirtualEvent]="onVirtualEvent"
                       [onNotification]="onNotification"

                       [jsfDefinitionProvider]="jsfDefinitionProvider"
                       [jsfComponentBuilder]="jsfComponentBuilder"

                       [forceRenderCdkOverlay]="true">
      </jsf-kal-jsf-doc>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfProxyFrameDocComponent implements OnInit, AfterViewInit, OnDestroy {

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  public ready = false;

  private observer: ResizeObserverInterface;
  private _onEvent: (event: FrameEvent) => void = () => {};


  /**************************************
   * JSF doc inputs
   **************************************/
  public doc: JsfDocument;
  public builderOptions: JsfBuilderOptions;
  public modes: string[];
  public debug?: boolean;
  public enableThemeRender?: boolean;
  public innerScroll?: boolean;
  public disableWrapperStyles?: boolean;
  public showLoadingIndicator?: boolean;
  public developerTools?: BuilderDeveloperToolsInterface;
  public showValidationErrors?: boolean;
  public linkedFormBuilder?: JsfBuilder;

  public onFormBuilderCreated: (formBuilder: JsfBuilder) => Promise<void>;
  public onError: (e: any) => Promise<void>;
  public onFormEvent: (data: JsfFormEventInterface) => Promise<any>;
  public onValueChange: (value: any) => Promise<any>;
  public onSubmit: () => Promise<any>;
  public onCustomEvent: (eventName: string, eventData: any, documentId?: string | ObjectID) => Promise<any>;
  public onVirtualEvent: (eventName: string, eventData: any) => Promise<any>;
  public onNotification: (notification: JsfNotificationInterface) => Promise<any>;

  public jsfDefinitionProvider: (key: string) => Observable<JsfDefinition>;
  public jsfComponentBuilder: JsfComponentBuilder;


  /**************************************
   * Component logic
   **************************************/
  constructor(private cdRef: ChangeDetectorRef,
              public zone: NgZone) {
    NgZone.assertInAngularZone();

    // Register component on window
    console.log(`[KalJsfProxyFrameDocComponent] Registering component...`);

    (window as any)['__JSF_PROXY_FRAME__'] = this;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  detectChanges() {
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  registerOnEventFn(fn: (event: FrameEvent) => void) {
    this._onEvent = fn;
  }

  observe() {
    if (!!this.observer) {
      return;
    }

    this.observer = new ResizeObserver((entries) => {
      if (entries.length !== 1) {
        throw new Error(`Invalid number of ResizeObserver entries.`);
      }

      const element = entries[0];

      const { width, height } = element.contentRect;

      this._onEvent({
        type: 'resize',
        data: {
          width,
          height
        }
      });
    });

    const body = document.querySelector<HTMLElement>('body');
    this.observer.observe(body);

    // Switch to scroll element once it's found on the page.
    const registerFormElement = () => {
      const targetElement = document.querySelector<HTMLElement>('jsf-kal-jsf-doc jsf-form-outlet form');
      if (!targetElement) {
        return setTimeout(registerFormElement, 50);
      }

      this.observer.unobserve(body);
      this.observer.observe(targetElement);

      // Immediately trigger another event
      const targetElementRect = targetElement.getBoundingClientRect();
      this._onEvent({
        type: 'resize',
        data: {
          width : targetElementRect.width,
          height: targetElementRect.height
        }
      });
    };
    registerFormElement();

    // Emit a resize event immediately when starting.
    const bodyRect = body.getBoundingClientRect();
    this._onEvent({
      type: 'resize',
      data: {
        width : bodyRect.width,
        height: bodyRect.height
      }
    });

    console.log(`[KalJsfProxyFrameDocComponent] Starting observation...`);
  }

  public disconnect() {
    if (!this.observer) {
      return;
    }

    this.observer.disconnect();
    this.observer = void 0;

    console.log(`[KalJsfProxyFrameDocComponent] Stopped observation`);
  }
}
