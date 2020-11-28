import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { Overlay, OverlayRef }                  from '@angular/cdk/overlay';
import { ComponentPortal }                      from '@angular/cdk/portal';
import { KalJsfBuilderActionBarComponent }      from '../kal-jsf-builder-common/kal-jsf-builder-action-bar/kal-jsf-builder-action-bar.component';
import { AbstractLayoutBuilderComponent }       from './abstract/abstract-layout-builder.component';
import { merge }                                from 'rxjs/internal/observable/merge';
import { JsfLayoutEditor }                      from '@kalmia/jsf-common-es2015';
import { Subject }                              from 'rxjs';
import { takeUntil }                            from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuilderActionBarService {

  private overlayRef: OverlayRef;
  private origin: ElementRef;
  private componentRef: ComponentRef<KalJsfBuilderActionBarComponent>;

  private unsubscribe: Subject<void>;

  public selected$: Subject<JsfLayoutEditor> = new Subject<JsfLayoutEditor>();

  private _selected: JsfLayoutEditor;
  public get selected(): JsfLayoutEditor {
    return this._selected;
  }

  public set selected(x: JsfLayoutEditor) {
    this._selected = x;
    this.selected$.next(x);
  }

  constructor(private overlay: Overlay) { }


  public select(layoutEditor: JsfLayoutEditor, builderComponent: AbstractLayoutBuilderComponent, origin: ElementRef) {
    if (this.selected && this.selected === layoutEditor) {
      return;
    }

    this.deselect();

    this.unsubscribe = new Subject<void>();

    this.selected = layoutEditor;
    this.origin   = origin;

    // Add selection to origin
    this.addOriginActionBarClass();

    // Create overlay
    this.overlayRef = this.overlay.create({
      // Position strategy defines where popup will be displayed
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(origin)
        .withPositions([{
          originX : 'center',
          originY : 'top',
          overlayX: 'center',
          overlayY: 'bottom'
        }
        ])
        .withViewportMargin(5)
        .withPush(true)
        .withGrowAfterOpen(true),
      // Popup reposition on scroll
      scrollStrategy  : this.overlay.scrollStrategies.reposition(),
      // Use no backdrop
      hasBackdrop     : false,
      backdropClass   : 'cdk-overlay-transparent-backdrop'
    });

    // Create and attach action bar
    const actionBarComponentPortal = new ComponentPortal(KalJsfBuilderActionBarComponent);

    this.componentRef = this.overlayRef.attach(actionBarComponentPortal);

    this.componentRef.instance.additionalTemplate = builderComponent.actionBarTemplate;
    this.componentRef.instance.layoutEditor       = layoutEditor;
    this.componentRef.changeDetectorRef.detectChanges();

    // Subscribe to action bar events
    this.componentRef.instance.close
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.deselect();
      });

    this.componentRef.instance.deleteLayout
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((layoutEditor: JsfLayoutEditor) => {
        layoutEditor.destroy();
        this.deselect();
      });

    // Handle closing
    merge(
      this.overlayRef.backdropClick(),
      this.overlayRef.detachments()
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.deselect();
      });
  }

  public deselect() {
    if (!this._selected) {
      return;
    }

    this.removeOriginActionBarClass();

    this.unsubscribe.next();
    this.unsubscribe.complete();

    this.overlayRef.dispose();
    this.overlayRef = void 0;

    this.selected = void 0;
    this.origin   = void 0;
  }


  public addOriginActionBarClass() {
    if (!this.origin) {
      return;
    }
    const node = this.origin.nativeElement.firstElementChild;
    if (!node) {
      this.origin.nativeElement.classList.add('d-block');
    }
    node.classList.add('jsf-builder-action-bar-selection');
  }

  public removeOriginActionBarClass() {
    if (!this.origin) {
      return;
    }
    const node = this.origin.nativeElement.firstElementChild;
    if (!node) {
      this.origin.nativeElement.classList.remove('d-block');
    }
    node.classList.remove('jsf-builder-action-bar-selection');
  }

}
