import {
  Bind,
  JsfAbstractLayoutBuilder,
  JsfAbstractService, JsfBuilder,
  JsfItemsLayoutBuilder,
  JsfLayoutRender2D, JsfLayoutRender3D,
  JsfSpecialLayoutBuilder, layoutClickHandlerService, PropStatus, PropStatusChangeInterface
} from '@kalmia/jsf-common-es2015';
import { flattenDeep }     from 'lodash';
import { isEvalObject }    from '@kalmia/jsf-common-es2015';
import { takeUntil }       from 'rxjs/operators';
import { Subject }         from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';

const BODY_CONTAINER_ELEMENT_ID = 'jsf-3d-preload-container';

export class RenderInstance {

  private unsubscribe: Subject<void> = new Subject<void>();
  private containerEl: HTMLElement;

  public renderEl: HTMLIFrameElement;

  public v3dReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private builder: JsfBuilder,
              private layoutBuilder: JsfSpecialLayoutBuilder,
              public source: string | { $eval: string, dependencies?: string []} ) {
    this.containerEl = document.getElementById(BODY_CONTAINER_ELEMENT_ID);

    if (!this.containerEl) {
      this.containerEl = document.createElement('div');
      this.containerEl.id = BODY_CONTAINER_ELEMENT_ID;
      this.containerEl.style.position = 'fixed';
      this.containerEl.style.top = '999999px';
      this.containerEl.style.left = '999999px';

      document.querySelector('body').append(this.containerEl);
    }

    this.create();
  }

  create() {
    if (isEvalObject(this.source)) {
      if (this.source.dependencies?.length) {
        for (const dependency of this.source.dependencies) {
          const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
          this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((status: PropStatusChangeInterface) => {
              if (status.status !== PropStatus.Pending) {
                this.createInternal();
              }
            });
        }
      }
    }

    this.createInternal();
  }

  loadInto(element: HTMLElement) {
    console.log('[3D Preload] Load into', element);
    element.appendChild(this.renderEl);
  }

  unload() {
    console.log('[3D Preload] Unload');
    this.containerEl.appendChild(this.renderEl);
  }

  private createInternal() {
    if (this.renderEl) {
      console.log('[3D Preload] Removing previous iframe');
      this.renderEl.remove();
    }

    // Get source URL.
    let iframeUrl;

    if (isEvalObject(this.source)) {
      const ctx       = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder: this.layoutBuilder
      });
      iframeUrl = this.layoutBuilder.rootBuilder.runEvalWithContext(
        (this.source as any).$evalTranspiled || this.source.$eval, ctx);
    } else {
      iframeUrl = this.source;
    }

    console.log(`[3D Preload] Creating iframe with url "${ iframeUrl }"`);
    this.renderEl = document.createElement('iframe');

    /*
    const updateIframeDocument = () => {
      this.renderEl.removeEventListener('load', updateIframeDocument);

      this.builder.apiService.get(iframeUrl, { responseType: 'text' })
        .subscribe(x => {

          const baseHrefTokens = iframeUrl.split('/');
          baseHrefTokens.pop();

          const baseHref = baseHrefTokens.join('/') + '/';

          x = x.replace(
            `<head>`,
            `<head><base href="${ baseHref }" />`
          );

          console.log('Update', x);

          this.renderEl.contentWindow.document.open();
          this.renderEl.contentWindow.document.write(x);
          this.renderEl.contentWindow.document.close();
        });
    };

    this.renderEl.addEventListener('load', updateIframeDocument);
    */

    this.renderEl.src = iframeUrl;
    
    this.containerEl.appendChild(this.renderEl);

    // Listen for iframe events
    window.addEventListener('message', this.onIframeMessage);
  }

  dispose() {
    this.unsubscribe.next();
    this.unsubscribe.complete();

    this.renderEl.remove();
  }

  @Bind()
  private onIframeMessage(message: any) {
    const event = message.data;

    switch (event.eventName) {
      case 'jsf:verge3d:loaded': {
        console.log(`[3D Preload] Iframe loaded`);
        this.v3dReady.next(true);
        break;
      }
    }
  }
}


export class Render3DPreloadService extends JsfAbstractService {

  // Map of layout builders and render instances
  private renderInstances: { [builderId: string]: RenderInstance } = {};


  constructor() {
    super();
  }

  public async onInit(): Promise<void> {
    const builders: JsfSpecialLayoutBuilder[] = this.getRender3DLayoutBuilders(this.builder.layoutBuilder);
    console.log('[3D Preload] Found 3D layout builders:', builders);

    // Create unique instances based on each builder source
    const instances = {};

    for (const builder of builders) {
      const layout = builder.layout as JsfLayoutRender3D;
      if (isEvalObject(layout.sourceUrl)) {
        if (!instances[layout.sourceUrl.$eval]) {
          instances[layout.sourceUrl.$eval] = new RenderInstance(this.builder, builder, layout.sourceUrl);
        }

        this.renderInstances[builder.id] = instances[layout.sourceUrl.$eval];
      } else {
        if (!instances[layout.sourceUrl as string]) {
          instances[layout.sourceUrl as string] = new RenderInstance(this.builder, builder, layout.sourceUrl);
        }

        this.renderInstances[builder.id] = instances[layout.sourceUrl as string];
      }
    }

    if (Object.keys(instances).length >= 2) {
      throw new Error('Multiple render sources are not yet supported.');
    }

    console.log('[3D Preload] Render Instances:', this.renderInstances);
  }


  public async onDestroy(): Promise<void> {
  }

  public async onAction(action: string, data: any): Promise<any> {
    switch (action) {
      case 'get-render-instance': {
        return this.getRenderInstance(data);
      }
      default: {
        throw new Error(`Unknown action "${ action }"`);
      }
    }
  }

  /**
   * Actions
   */

  /**
   * Redirects the user to Stripe's Checkout page.
   */
  private async getRenderInstance(layoutBuilderId: string) {
    return this.renderInstances[layoutBuilderId];
  }


  private getRender3DLayoutBuilders(layoutBuilder: JsfAbstractLayoutBuilder<any>) {
    const out = [];

    if (layoutBuilder instanceof JsfItemsLayoutBuilder) {
      layoutBuilder.items.forEach(x => {
        out.push(...this.getRender3DLayoutBuilders(x));
      });
    } else if (layoutBuilder instanceof JsfSpecialLayoutBuilder) {
      if (layoutBuilder.type === 'render-3d') {
        out.push(layoutBuilder);
      }
    }

    return flattenDeep(out);
  }
}
