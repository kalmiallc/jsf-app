import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
  ViewChild,
  ViewContainerRef
}                                         from '@angular/core';
import { JsfLayoutEditor, JsfRegister }   from '@kalmia/jsf-common-es2015';
import { Subject }                        from 'rxjs';
import { BuilderActionBarService }        from '../builder-action-bar.service';
import { DragDropService, DragDropState } from '../drag-drop.service';
import { takeUntil }                      from 'rxjs/operators';
import { BuilderNotificationService }     from '../../builder-notification.service';
import { canActivateLayoutItem }          from '@kalmia/jsf-common-es2015/lib/builder/layout/layout-util';
import { BuilderPreferencesService }      from '../../builder-preferences.service';


@Component({
  selector       : 'jsf-layout-builder-items-router',
  template       : `
      <jsf-layout-builder-router-droppable [ngxDroppable]="droppableId"
                                           [attr.jsf-layout-builder-drop-zone-id]="parent.id"
                                           [ngClass]="containerElementClass"
                                           (drag)="dropStart($event)"
                                           (cancel)="dropCancel($event)"
                                           (drop)="dropFinish($event)"
                                           #container>
          <ng-container *ngFor="let item of items; let i = index; trackBy: trackByFn">
              <jsf-layout-builder-router *ngIf="canActivateBuilderItem(item)"
                                         [ngxDraggable]="[droppableId]"
                                         [model]="item"
                                         [idAttr]="item.id"
                                         [elementClass]="containerItemElementClasses && containerItemElementClasses[i]"
                                         [layoutEditor]="item">
              </jsf-layout-builder-router>
          </ng-container>

          <ng-container #routerOutlet></ng-container>
      </jsf-layout-builder-router-droppable>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LayoutBuilderRouterItemsComponent implements OnInit, OnDestroy {

  @ViewChild('routerOutlet', { read: ViewContainerRef, static: false })
  private routerOutlet: ViewContainerRef;

  @ViewChild('container', { read: ElementRef, static: true })
  private containerElement: ElementRef;

  @HostBinding('class.droppable-disabled')
  get dropDisabledClass(): boolean {
    return !this.droppableId;
  }

  @Input()
  items: JsfLayoutEditor[];

  @Input()
  parent: JsfLayoutEditor;

  /**
   * Class to be applied to the drag container.
   */
  @Input()
  containerElementClass?: string;

  /**
   * Class to be applied to the drag container elements. An array where each element is the class to be applied to each builder item, in
   * order.
   */
  @Input()
  containerItemElementClasses?: string[];

  public droppableId: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private cdRef: ChangeDetectorRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private actionBarService: BuilderActionBarService,
              private dragDropService: DragDropService,
              private builderNotificationService: BuilderNotificationService,
              private builderPreferencesService: BuilderPreferencesService,
              @SkipSelf() protected parentCdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.setDroppableId();

    this.parent.updateLayout$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.detectChanges();
      });

    this.dragDropService.state$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((newState: DragDropState) => {
        if (newState.state) {
          if (this.parent.canAddItem(newState.layoutDefinition)) {
            this.setDroppableId();
          } else {
            this.clearDroppableId();
          }
        } else {
          this.setDroppableId();
        }
      });

    this.builderPreferencesService.update$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.detectChanges();
      });
  }


  /**
   * Destroy.
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private detectChanges() {
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
    this.parentCdRef.markForCheck();
    this.parentCdRef.detectChanges();
  }

  public canActivateBuilderItem(item: JsfLayoutEditor) {
    return canActivateLayoutItem(this.builderPreferencesService.get('editor-selected-layout-modes', []), item.mutableDefinition);
  }

  private setDroppableId() {
    this.droppableId = `editor${ this.parent.jsfEditor.id }`;
    this.detectChanges();
  }

  private clearDroppableId() {
    this.droppableId = void 0;
    this.detectChanges();
  }

  dropStart(event: any) {
    if (event instanceof DragEvent) {
      return;
    }

    this.actionBarService.deselect();
    this.dragDropService.start(this.parent.jsfEditor, event.value.realType);
  }

  dropCancel(event: any) {
    this.actionBarService.deselect();
    this.dragDropService.stop(this.parent.jsfEditor);
  }

  dropFinish(event: any) {
    this.actionBarService.deselect();
    this.dragDropService.stop(this.parent.jsfEditor);

    const layoutId = event.el.getAttribute('jsf-layout-builder-id');
    const index    = event.dropIndex;

    if (layoutId) {
      const layoutItem = this.parent.jsfEditor.getLayoutById(layoutId);
      layoutItem.moveTo(this.parent, index);
    } else {
      // Delete the placeholder item
      event.el.remove();

      // Item has no ID, check if this was supposed to be a new item dragged from the toolbox
      const newLayoutType = event.value;
      if (newLayoutType) {
        // Get the new definition and then add the item.
        const def = JsfRegister.getNewLayoutDefinition(newLayoutType) as any;
        if (def) {
          try {
            this.parent.createItem(def, index);
          } catch (e) {
            return this.builderNotificationService.showNotification({
              level  : 'error',
              message: `Drag action failed (${ e.toString() })`
            });
          }
        } else {
          return this.builderNotificationService.showNotification({
            level  : 'error',
            message: `Drag action failed (no definition found for layout type "${ newLayoutType }")`
          });
        }
      } else {
        return this.builderNotificationService.showNotification({
          level  : 'error',
          message: `Drag action failed (invalid drag attempt)`
        });
      }
    }
  }

  trackByFn(index: number, item: JsfLayoutEditor) {
    return item.id;
  }
}
