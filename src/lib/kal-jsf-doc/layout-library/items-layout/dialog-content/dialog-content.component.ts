import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { AbstractItemsLayoutComponent }                                                   from '../../../abstract/items-layout.component';
import { JsfItemsLayoutBuilder, JsfLayoutDialogContent }                                  from '@kalmia/jsf-common-es2015';
import { BuilderDeveloperToolsInterface }                                                 from '../../../builder-developer-tools.interface';
import * as OverlayScrollbars                                                             from 'overlayscrollbars';
import { jsfDefaultScrollOptions }                                                        from '../../../../utilities';
import { OverlayScrollbarsComponent }                                                     from 'overlayscrollbars-ngx';
import { OverlayScrollbarsService }                                                       from '../../../services/overlay-scrollbars.service';


@Component({
  selector       : 'jsf-layout-dialog-content',
  template       : `
      <mat-dialog-content class="jsf-layout-dialog-content jsf-animatable"
                          [ngClass]="getLayoutInnerClass()"
                          [ngStyle]="getLayoutInnerStyle()"
                          (click)="handleLayoutClick($event)">
          <overlay-scrollbars [options]="scrollOptions">
              <jsf-layout-router *ngFor="let item of layoutBuilder.items"
                                 [layoutBuilder]="item"
                                 [developerTools]="developerTools"
                                 [ngClass]="getLayoutItemClass(item)"
                                 [ngStyle]="getLayoutItemStyle(item)">
              </jsf-layout-router>
          </overlay-scrollbars>
      </mat-dialog-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
      `.mat-dialog-content {
          overflow: hidden;
      }`
  ]
})
export class LayoutDialogContentComponent extends AbstractItemsLayoutComponent<JsfLayoutDialogContent> implements AfterViewInit, OnDestroy {

  @Input()
  layoutBuilder: JsfItemsLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChild(OverlayScrollbarsComponent, { static: false })
  osComponent: OverlayScrollbarsComponent;

  public readonly scrollOptions: OverlayScrollbars.Options = {
    ...jsfDefaultScrollOptions,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    resize          : 'none',
    paddingAbsolute : true
  };

  constructor(private osService: OverlayScrollbarsService) {
    super();
  }

  public ngAfterViewInit(): void {
    this.osService.registerOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.osService.deregisterOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }
}
