import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
}                                         from '@angular/core';
import {
  Bind,
  JsfLayoutRender3D,
  JsfSpecialLayoutBuilder,
  layoutClickHandlerService,
  PropStatus,
  PropStatusChangeInterface
}                                         from '@kalmia/jsf-common-es2015';
import { AbstractSpecialLayoutComponent } from '../../../abstract/special-layout.component';
import { ScriptInjectorService }          from '../../../services/script-injector.service';
import { BuilderDeveloperToolsInterface } from '../../../builder-developer-tools.interface';
import {
  DomSanitizer,
  SafeResourceUrl
}                                         from '@angular/platform-browser';
import { takeUntil }                      from 'rxjs/operators';
import { RenderInstance }                 from '../../../service-library/3d-preload.service';


let render3dCount = 0;

@Component({
  selector       : 'jsf-layout-render-3d',
  template       : `
    <div class="jsf-layout-render-3d jsf-animatable" [ngClass]="htmlClass" id="jsf-render-3d-{{ render3dId }}" #preloadPlaceholder>
      <iframe class="rounded-sm" *ngIf="!usingPreload && sourceUrl"
              [src]="sourceUrl"
              #iframeContainer
              allowfullscreen
              [style.width]="width"
              [style.height]="height">
      </iframe>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
    `:host ::ng-deep iframe {
      border: none;
    }`
  ]
})
export class LayoutRender3DComponent extends AbstractSpecialLayoutComponent<JsfLayoutRender3D> implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  layoutBuilder: JsfSpecialLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChild('iframeContainer', { read: ElementRef, static: false })
  iframeContainer: ElementRef;

  @ViewChild('preloadPlaceholder', { read: ElementRef, static: true })
  preloadContainer: ElementRef;


  public render3dId = ++render3dCount;

  private inlineIframeLoaded = false;

  private _sourceUrl: SafeResourceUrl;
  get sourceUrl() {
    return this._sourceUrl;
  }

  get width() {
    return this.layout.width ?? '100%';
  }

  get height() {
    return this.layout.height ?? '100%';
  }

  get dependencies(): string[] {
    return this.isEvalObject(this.layout.sourceUrl) ? this.layout.sourceUrl.dependencies || [] : [];
  }

  get preloadService() {
    return this.layoutBuilder.rootBuilder.services['3d-preload'];
  }

  get usingPreload() {
    return !!this.preloadService;
  }

  constructor(private scriptInjector: ScriptInjectorService,
              private sanitizer: DomSanitizer,
              private zone: NgZone,
              private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
  }

  public async ngOnDestroy() {
    super.ngOnDestroy();

    if (this.usingPreload) {
      const renderInstance: RenderInstance = await this.preloadService.onAction('get-render-instance', this.layoutBuilder.id);
      renderInstance.unload();
    }
  }

  public ngAfterViewInit() {
    window.addEventListener('message', this.onIframeMessage);

    if (!this.usingPreload) {
      console.log('[Render3D] Initializing without preload.');

      if (this.isEvalObject(this.layout.sourceUrl)) {
        if (this.dependencies.length) {
          for (const dependency of this.dependencies) {
            const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
            this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((status: PropStatusChangeInterface) => {
                if (status.status !== PropStatus.Pending) {
                  this.initializeRendererWithoutPreload();
                }
              });
          }
        }
      }
      this.initializeRendererWithoutPreload();
    } else {
      console.log('[Render3D] Initializing with preload.');
      this.initializeRendererWithPreload()
        .catch(e => console.error(e));
    }
  }


  private initializeMessageBridge() {
    // Set up value change subscription.
    this.layoutBuilder.rootBuilder.statusChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((status: PropStatus) => {
        if (status !== PropStatus.Pending) {
          this.executeIframeValueChangeProcedure();
        }
      });
  }

  private async initializeRendererWithPreload() {
    const renderInstance: RenderInstance = await this.preloadService.onAction('get-render-instance', this.layoutBuilder.id);

    renderInstance.loadInto(this.preloadContainer.nativeElement);
    renderInstance.renderEl.classList.add('rounded-sm');
    renderInstance.renderEl.allowFullscreen = true;
    renderInstance.renderEl.style.width     = this.width;
    renderInstance.renderEl.style.height    = this.height;

    renderInstance.v3dReady
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((ready: boolean) => {
        if (ready) {
          this.initializeMessageBridge();
          this.executeIframeInitProcedure();
        }
      });
  }

  private initializeRendererWithoutPreload() {
    this.inlineIframeLoaded = false;

    // Get source URL.
    if (this.isEvalObject(this.layout.sourceUrl)) {
      const ctx       = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder: this.layoutBuilder
      });
      this._sourceUrl = this.layoutBuilder.rootBuilder.runEvalWithContext(
        (this.layout.sourceUrl as any).$evalTranspiled || this.layout.sourceUrl.$eval, ctx);
    } else {
      this._sourceUrl = this.layout.sourceUrl;
    }

    this._sourceUrl = this._sourceUrl && this.sanitizer.bypassSecurityTrustResourceUrl(this._sourceUrl as any);

    this.initializeMessageBridge();
    this.cdRef.detectChanges();
  }


  @Bind()
  private onIframeMessage(message: any) {
    this.zone.run(() => {
      const event = message.data;

      switch (event.eventName) {
        case 'jsf:verge3d:loaded': {
          if (!this.usingPreload) {
            console.log('[Render3D] Verge3D loaded');
            this.inlineIframeLoaded = true;
            this.executeIframeInitProcedure();
          }
          break;
        }
        case 'jsf:event': {
          console.log('[Render3D] Event');

          layoutClickHandlerService.handleOnClick(this.layout.onEvent, {
            rootBuilder       : this.layoutBuilder.rootBuilder,
            layoutBuilder     : this.layoutBuilder,
            extraContextParams: {
              $eventData: event
            }
          }).catch(console.error);

          break;
        }
        case 'jsf:prop:set-value': {
          try {
            console.log('[Render3D] Set value on prop ' + event.data.path + ' with value:', event.data.value);
            const prop = this.layoutBuilder.rootBuilder
              .getProp(event.data.path);

            if (prop) {
              prop.setValue(event.data.value)
                .catch(e => console.error('[Render3D] Failed to set value on prop', e));
            } else {
              console.error('[Render3D] Prop ' + event.data.path + ' not found.');
            }
          } catch (e) {
            console.error('[Render3D] Failed to set value on prop', e);
          }
          break;
        }
        default: {
          console.error(`Unknown event "${ event.eventName }"`);
        }
      }
    });
  }

  private executeIframeInitProcedure() {
    this.dispatchEvent('jsf:init', {
      formValue: this.layoutBuilder.rootBuilder.getJsonValue()
    }).catch(e => console.error(e));
  }

  private executeIframeValueChangeProcedure() {
    this.dispatchEvent('jsf:value-change', {
      formValue: this.layoutBuilder.rootBuilder.getJsonValue()
    }).catch(e => console.error(e));
  }

  private async dispatchEvent(eventName: string, data: any) {
    if (this.usingPreload) {
      const renderInstance: RenderInstance = await this.preloadService.onAction('get-render-instance', this.layoutBuilder.id);

      console.log('[Render3D] Dispatching message', eventName, data);
      (renderInstance.renderEl as HTMLIFrameElement).contentWindow.postMessage({
        ['jsf-render-3d']: true,
        eventName,
        data
      }, '*');
    } else {
      if (this.iframeContainer && this.inlineIframeLoaded) {
        console.log('[Render3D] Dispatching message', eventName, data);
        (this.iframeContainer.nativeElement as HTMLIFrameElement).contentWindow.postMessage({
          ['jsf-render-3d']: true,
          eventName,
          data
        }, '*');
      }
    }
  }

  private isEvalObject(x: any): x is { $eval: string, dependencies?: string[] } {
    return typeof x === 'object' && '$eval' in x;
  }

}
