import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
}                                                                                                from '@angular/core';
import { Bind, JsfLayoutIframe, JsfSpecialLayoutBuilder, PropStatus, PropStatusChangeInterface } from '@kalmia/jsf-common-es2015';
import { AbstractSpecialLayoutComponent }                                                        from '../../../abstract/special-layout.component';
import { takeUntil }                                                                             from 'rxjs/operators';
import { DomSanitizer }                                                                          from '@angular/platform-browser';
import { interval, Subscription }                                                                from 'rxjs';
import { uniq }                                                                                  from 'lodash';

@Component({
  selector       : 'jsf-layout-iframe',
  template       : `
      <iframe class="jsf-layout-iframe jsf-animatable"
              frameborder="0"
              scrolling="no"
              #iframe
              [ngClass]="htmlClass"
              (click)="handleLayoutClick($event)">
      </iframe>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LayoutIframeComponent extends AbstractSpecialLayoutComponent<JsfLayoutIframe> implements OnInit, AfterViewInit {

  @Input()
  layoutBuilder: JsfSpecialLayoutBuilder;

  private observer: IntersectionObserver;

  private activeSections: string[];


  // Used in order to bypass cross origin script inject problem
  _rawSrc: string;
  src: string;
  _srcObservable: Subscription;

  @ViewChild('iframe', { static: true })
  private iframeElement: ElementRef;


  get dependencies(): string[] {
    return this.layout.templateData ? this.layout.templateData.dependencies || [] : [];
  }

  get sectionTrackingInterval(): number {
    return this.layout.sectionTrackingInterval;
  }

  get onSectionTrack(): { $eval: string } {
    return this.layout.onSectionTrack;
  }


  constructor(
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.sectionTrackingInterval) {
      this.observer = new IntersectionObserver(this.observerCallback, {
        threshold : 0,
        rootMargin: '20px 10px 20px 10px'
      });

      interval(this.sectionTrackingInterval)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.emitActiveSections();
        });
    }
  }

  public ngAfterViewInit(): void {
    this.updateSource();

    if (this.layout.templateData) {
      if (this.dependencies.length) {
        for (const dependency of this.dependencies) {
          const dependencyAbsolutePath = this.layoutBuilder.abstractPathToAbsolute(dependency);
          this.layoutBuilder.rootBuilder.listenForStatusChange(dependencyAbsolutePath)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status: PropStatusChangeInterface) => {
              if (status.status !== PropStatus.Pending) {
                this.updateSource();
                this.cdRef.detectChanges();
              }
            });
        }
      } else {
        if (this.layoutBuilder.rootBuilder.warnings) {
          console.warn(`Layout 'iframe' [${ this.layoutBuilder.id }] uses templateData but has not listed any dependencies.`,
            `The component will be updated on every form value change which may decrease performance.`);
        }
        this.layoutBuilder.rootBuilder.propBuilder.statusChange
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((status: PropStatus) => {
            if (status !== PropStatus.Pending) {
              this.updateSource();
              this.cdRef.detectChanges();
            }
          });
      }
    }
  }

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    if (event.data?.jsfLayoutIframe) {
      // Set height
      this.iframeElement.nativeElement.style.height = event.data?.jsfLayoutIframe.height + 'px';

      // Set up intersection observer
      if (this.observer) {
        this.observer.disconnect();
        const elementsToObserve: HTMLElement[] = (this.iframeElement.nativeElement as HTMLIFrameElement).contentWindow['JSF_IFRAME_GET_SECTIONS']();
        this.activeSections = elementsToObserve.map(x => x.getAttribute('jsf-iframe-section'));
        elementsToObserve.map(x => this.observer.observe(x));
      }
    }
  }

  @Bind()
  private observerCallback(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    // console.log(entries);
    for (const entry of entries) {
      const sectionKey = entry.target.getAttribute('jsf-iframe-section');
      if (entry.isIntersecting) {
        this.activeSections = uniq(this.activeSections.concat([sectionKey]));
      } else {
        this.activeSections = this.activeSections.filter(x => x !== sectionKey);
      }
    }
  }

  private _fixHtmlSrc(html: string): string {
    html = html.replace(
      `</body>`,
      `<script>
          // Iframe resize
          window.addEventListener('load', function(){
              parent.postMessage({
                jsfLayoutIframe: {
                  height: document.body.offsetHeight
                }
              }, '*');
          });
          
          function JSF_IFRAME_GET_SECTIONS() {
            return Array.from(document.querySelectorAll('[jsf-iframe-section]'))
          }
          </script></body>`
    );
    // html = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/html,' + encodeURIComponent(html)) as string;
    return html;
  }

  updateSource() {
    if (this.layout.sameOriginSrc) {
      this.src = this.layout.sameOriginSrc;
      return this.updateContent();
    }
    const templateData = this.getTemplateData();

    let src = this.layout.src;
    if (templateData) {
      const template = this.translationServer.getTemplate(this.i18n(src));
      src            = template(templateData);
    }
    if (src.trim().startsWith('<')) {
      this._rawSrc = src;
      this.src     = this._fixHtmlSrc(src);
      return this.updateContent();
    }

    if (this._rawSrc !== src) {
      this._rawSrc = src;
      if (this._srcObservable) {
        this._srcObservable.unsubscribe();
      }
      this._srcObservable = this.layoutBuilder.rootBuilder.apiService.get(this._rawSrc, { responseType: 'text' })
        .subscribe(x => {
          this.src = this._fixHtmlSrc(x);
          return this.updateContent();
        }, e => {
          console.error(e);
        });
    }
  }

  private updateContent() {
    const iframe = this.iframeElement.nativeElement as HTMLIFrameElement;
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(this.src);
    iframe.contentWindow.document.close();
  }

  private emitActiveSections() {
    const ctx = this.layoutBuilder.rootBuilder.getEvalContext({
      layoutBuilder     : this.layoutBuilder,
      extraContextParams: {
        $activeSections: this.activeSections
      }
    });
    this.layoutBuilder.rootBuilder.runEvalWithContext(
      (this.onSectionTrack as any).$evalTranspiled || this.onSectionTrack.$eval, ctx);
  }

  getTemplateData(): any {
    if (this.layout.templateData) {

      const ctx = this.layoutBuilder.rootBuilder.getEvalContext({
        layoutBuilder: this.layoutBuilder
      });
      return this.layoutBuilder.rootBuilder.runEvalWithContext(
        (this.layout.templateData as any).$evalTranspiled || this.layout.templateData.$eval, ctx);

    }
  }
}
