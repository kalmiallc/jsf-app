import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  Bind,
  JsfLayoutRender3D,
  JsfSpecialLayoutBuilder,
  PropStatus,
  PropStatusChangeInterface,
  layoutClickHandlerService
}                                         from '@kalmia/jsf-common-es2015';
import { AbstractSpecialLayoutComponent } from '../../../abstract/special-layout.component';
import { ScriptInjectorService }          from '../../../services/script-injector.service';
import { BuilderDeveloperToolsInterface } from '../../../builder-developer-tools.interface';
import {
  DomSanitizer,
  SafeResourceUrl
}                                         from '@angular/platform-browser';
import { takeUntil }                      from 'rxjs/operators';


let render3dCount = 0;

@Component({
  selector       : 'jsf-layout-render-3d',
  template       : `
      <div class="jsf-layout-render-3d jsf-animatable" [ngClass]="htmlClass" id="jsf-render-3d-{{ render3dId }}">
          <iframe class="rounded-sm" *ngIf="sourceUrl" [src]="sourceUrl" #iframeContainer allowfullscreen [style.width]="width" [style.height]="height"></iframe>
      </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
      `iframe {
          border: none;
      }`
  ]
})
export class LayoutRender3DComponent extends AbstractSpecialLayoutComponent<JsfLayoutRender3D> implements OnInit, AfterViewInit {

  @Input()
  layoutBuilder: JsfSpecialLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChild('iframeContainer', { read: ElementRef, static: false })
  iframeContainer: ElementRef;

  public render3dId = ++render3dCount;

  private iframeLoaded = false;

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

  constructor(private scriptInjector: ScriptInjectorService,
              private sanitizer: DomSanitizer,
              private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    if (this.isEvalObject(this.layout.sourceUrl)) {
      if (this.dependencies.length) {
        for (const dependency of this.dependencies) {
          const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
          this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status: PropStatusChangeInterface) => {
              if (status.status !== PropStatus.Pending) {
                this.initializeRenderer();
              }
            });
        }
      }
    }
  }

  public ngAfterViewInit() {
    this.initializeListeners();
    this.initializeRenderer();
  }


  private initializeListeners() {
    // Set up value change subscription.
    this.layoutBuilder.rootBuilder.statusChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((status: PropStatus) => {
        if (status !== PropStatus.Pending) {
          this.executeIframeValueChangeProcedure();
        }
      });

    window.addEventListener('message', this.onIframeMessage);
  }

  private initializeRenderer() {
    this.iframeLoaded = false;

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
    this.cdRef.detectChanges();
  }


  @Bind()
  private onIframeMessage(message: any) {
    const event = message.data;

    switch (event.eventName) {
      case 'jsf:verge3d:loaded': {
        console.log('[Render3D] Verge3D loaded');
        this.iframeLoaded = true;
        this.executeIframeInitProcedure();
        break;
      }
      case 'jsf:event': {
        console.log('[Render3D] Event');
        layoutClickHandlerService.handleOnClick(this.layout.onEvent, {
          rootBuilder  : this.layoutBuilder.rootBuilder,
          layoutBuilder: this.layoutBuilder,
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
  }

  private executeIframeInitProcedure() {
    this.dispatchEvent('jsf:init', {
      formValue: this.layoutBuilder.rootBuilder.getJsonValue()
    });
  }

  private executeIframeValueChangeProcedure() {
    this.dispatchEvent('jsf:value-change', {
      formValue: this.layoutBuilder.rootBuilder.getJsonValue()
    });
  }

  private dispatchEvent(eventName: string, data: any) {
    if (this.iframeContainer && this.iframeLoaded) {
      console.log('[Render3D] Dispatching message', eventName, data);
      (this.iframeContainer.nativeElement as HTMLIFrameElement).contentWindow.postMessage({
        ['jsf-render-3d']: true,
        eventName,
        data
      }, '*');
    }
  }

  private isEvalObject(x: any): x is { $eval: string, dependencies?: string[] } {
    return typeof x === 'object' && '$eval' in x;
  }

}
