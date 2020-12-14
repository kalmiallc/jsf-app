import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractItemsLayoutComponent }                                                                   from '../../../abstract/items-layout.component';
import { JsfItemsLayoutBuilder, JsfLayoutFloatingDiv }                                                    from '@kalmia/jsf-common-es2015';
import { BuilderDeveloperToolsInterface }                                                                 from '../../../builder-developer-tools.interface';


@Component({
  selector       : 'jsf-layout-div',
  template       : `
      <div class="jsf-layout-floating-div jsf-animatable"
           [id]="id"
           [ngClass]="getLayoutInnerClass()"
           [ngStyle]="getLayoutInnerStyle()"
           [class.p-horiz-left]="positionHorizontal === 'left'"
           [class.p-horiz-center]="positionHorizontal === 'center'"
           [class.p-horiz-right]="positionHorizontal === 'right'"
           [class.p-vert-top]="positionVertical === 'top'"
           [class.p-vert-middle]="positionVertical === 'middle'"
           [class.p-vert-bottom]="positionVertical === 'bottom'"
           [class.rotation-enabled]="rotation"
           (click)="handleLayoutClick($event)">
          <jsf-layout-router *ngFor="let item of layoutBuilder.items"
                             [layoutBuilder]="item"
                             [developerTools]="developerTools"
                             [ngClass]="getLayoutItemClass(item)"
                             [ngStyle]="getLayoutItemStyle(item)">
          </jsf-layout-router>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./floating-div.component.scss']
})
export class LayoutFloatingDivComponent extends AbstractItemsLayoutComponent<JsfLayoutFloatingDiv> implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  layoutBuilder: JsfItemsLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  get position() {
    return this.layout.position;
  }

  get rotation() {
    return this.layout.rotation ?? true;
  }

  get positionVertical() {
    const tokens = this.position.split(' ').filter(x => x === 'top' || x === 'bottom' || x === 'middle');
    return tokens.length ? tokens[tokens.length - 1] : 'middle';
  }

  get positionHorizontal() {
    const tokens = this.position.split(' ').filter(x => x === 'left' || x === 'right' || x === 'center');
    return tokens.length ? tokens[tokens.length - 1] : 'center';
  }

  constructor(private cdRef: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
