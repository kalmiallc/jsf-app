import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-menu-item',
  template       : `
      <div class="jsf-lb-menu-item jsf-animatable" 
           [ngClass]="getLayoutEditorClass()">
          <mat-icon *ngIf="icon" class="jsf-layout-menu-item-icon">{{ icon }}</mat-icon>
          <span class="jsf-layout-menu-item-title">{{ title }}</span>
          <span class="jsf-layout-menu-item-description">{{ description }}</span>

          <jsf-layout-builder-items-router
                  *ngIf="layoutEditor.supportsItems"
                  [parent]="layoutEditor"
                  [items]="layoutEditor.items">
          </jsf-layout-builder-items-router>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbMenuItemComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  get icon(): string {
    return this.layout.icon;
  }

  get title(): string {
    return this.layout.title;
  }

  get description(): string {
    return this.layout.description;
  }


  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
