import { ChangeDetectionStrategy, Component, Input }     from '@angular/core';
import { AbstractItemsLayoutComponent }                  from '../../../abstract/items-layout.component';
import { JsfItemsLayoutBuilder, JsfLayoutDrawerContent } from '@kalmia/jsf-common-es2015';
import { BuilderDeveloperToolsInterface }            from '../../../builder-developer-tools.interface';


@Component({
  selector       : 'jsf-layout-drawer-content',
  template       : `
    <div class="jsf-layout-drawer-content jsf-animatable"
         [ngClass]="getLayoutInnerClass()"
         [ngStyle]="getLayoutInnerStyle()"
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
  styles         : []
})
export class LayoutDrawerContentComponent extends AbstractItemsLayoutComponent<JsfLayoutDrawerContent> {

  @Input()
  layoutBuilder: JsfItemsLayoutBuilder;

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;
}
