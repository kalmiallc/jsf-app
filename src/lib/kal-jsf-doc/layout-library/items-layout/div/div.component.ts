import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractItemsLayoutComponent }        from '../../../abstract/items-layout.component';
import { JsfItemsLayoutBuilder, JsfLayoutDiv } from '@kalmia/jsf-common-es2015';
import { BuilderDeveloperToolsInterface }      from '../../../builder-developer-tools.interface';
import * as OverlayScrollbars                  from 'overlayscrollbars';
import { OverlayScrollbarsComponent }          from 'overlayscrollbars-ngx';
import { jsfDefaultScrollOptions }             from '../../../../utilities';
import { OverlayScrollbarsService }            from '../../../services/overlay-scrollbars.service';


@Component({
  selector       : 'jsf-layout-div',
  template       : `
    <div class="jsf-layout-div jsf-animatable"
         [id]="id"
         [ngClass]="getLayoutInnerClass()"
         [ngStyle]="getLayoutInnerStyle()"
         [class.jsf-layout-div-scrollable]="verticalScroll || horizontalScroll"
         (click)="handleLayoutClick($event)">
      <ng-container *ngIf="verticalScroll || horizontalScroll; else noScroll">
        <overlay-scrollbars [options]="scrollOptions" #scrollEl>
            <jsf-layout-router *ngFor="let item of layoutBuilder.items"
                               [layoutBuilder]="item"
                               [developerTools]="developerTools"
                               [ngClass]="getLayoutItemClass(item)"
                               [ngStyle]="getLayoutItemStyle(item)">
            </jsf-layout-router>
        </overlay-scrollbars>
      </ng-container>
        
      <ng-template #noScroll>
          <jsf-layout-router *ngFor="let item of layoutBuilder.items"
                             [layoutBuilder]="item"
                             [developerTools]="developerTools"
                             [ngClass]="getLayoutItemClass(item)"
                             [ngStyle]="getLayoutItemStyle(item)">
          </jsf-layout-router>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
    `
        :host > .jsf-layout-div-scrollable {
            position: relative;
        }
      
        :host > .jsf-layout-div-scrollable > .os-host {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    `
  ]
})
export class LayoutDivComponent extends AbstractItemsLayoutComponent<JsfLayoutDiv> implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  layoutBuilder: JsfItemsLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  @ViewChild('scrollEl', { read: OverlayScrollbarsComponent })
  osComponent: OverlayScrollbarsComponent;

  public scrollOptions: OverlayScrollbars.Options;

  constructor(private osService: OverlayScrollbarsService) {
    super();
  }


  public ngOnInit(): void {
    this.scrollOptions = {
      ... jsfDefaultScrollOptions,
      overflowBehavior: {
        x: this.horizontalScroll ? 'scroll' : 'hidden',
        y: this.verticalScroll ? 'scroll' : 'hidden'
      },
      resize          : 'none',
      paddingAbsolute : true,
      clipAlways: false,
      callbacks: {
        onScrollStop: this.getScrollHook('onScrollStop') && (() => this.runScrollHook('onScrollStop'))
      }
    };
  }


  public ngAfterViewInit(): void {
    this.osService.registerOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }


  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.osService.deregisterOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }

  get verticalScroll() {
    return this.layout.scroll && this.layout.scroll.vertical;
  }

  get horizontalScroll() {
    return this.layout.scroll && this.layout.scroll.horizontal;
  }

  public getScrollHook(hookName: string) {
    return this.layout.scroll && this.layout.scroll[hookName];
  }

  public runScrollHook(hookName: string) {
    const hook = this.getScrollHook(hookName);
    const scrollInstance = this.osComponent.osInstance();

    const ctx = this.layoutBuilder.rootBuilder.getEvalContext({
      layoutBuilder: this.layoutBuilder,
      extraContextParams: {
        $osInstance: scrollInstance
      }
    });
    return this.layoutBuilder.rootBuilder.runEvalWithContext(
      (hook as any).$evalTranspiled || hook.$eval, ctx);
  }
}
