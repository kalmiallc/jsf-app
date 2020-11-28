import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-heading',
  template       : `
      <ng-container [ngSwitch]="level">
          <h1 *ngSwitchCase="1" (dblclick)="editMode = !editMode" [attr.contenteditable]="editMode" class="jsf-layout-heading jsf-animatable"
              [ngClass]="htmlClass">{{ title }}</h1>
          <h2 *ngSwitchCase="2" (dblclick)="editMode = !editMode" [attr.contenteditable]="editMode" class="jsf-layout-heading jsf-animatable"
              [ngClass]="htmlClass">{{ title }}</h2>
          <h3 *ngSwitchCase="3" (dblclick)="editMode = !editMode" [attr.contenteditable]="editMode" class="jsf-layout-heading jsf-animatable"
              [ngClass]="htmlClass">{{ title }}</h3>
          <h4 *ngSwitchCase="4" (dblclick)="editMode = !editMode" [attr.contenteditable]="editMode" class="jsf-layout-heading jsf-animatable"
              [ngClass]="htmlClass">{{ title }}</h4>
          <h5 *ngSwitchCase="5" (dblclick)="editMode = !editMode" [attr.contenteditable]="editMode" class="jsf-layout-heading jsf-animatable"
              [ngClass]="htmlClass">{{ title }}</h5>
          <h6 *ngSwitchCase="6" (dblclick)="editMode = !editMode" [attr.contenteditable]="editMode" class="jsf-layout-heading jsf-animatable"
              [ngClass]="htmlClass">{{ title }}</h6>
          <pre *ngSwitchDefault>Unknown heading level: {{ level }} - expected 1 to 6</pre>
      </ng-container>

      <ng-template #actionBarTemplate>
          <jsf-kal-jsf-builder-action-bar-button icon="format_size" [matMenuTriggerFor]="headingMenu"></jsf-kal-jsf-builder-action-bar-button>
          
          <jsf-kal-jsf-builder-action-bar-button icon="format_bold" [active]="hasHtmlClass('font-weight-bold')" (click)="toggleHtmlClass('font-weight-bold')"></jsf-kal-jsf-builder-action-bar-button>
          <jsf-kal-jsf-builder-action-bar-button icon="format_italic" [active]="hasHtmlClass('font-italic')" (click)="toggleHtmlClass('font-italic')"></jsf-kal-jsf-builder-action-bar-button>
          <jsf-kal-jsf-builder-action-bar-button icon="format_underline" [active]="hasHtmlClass('text-decoration-underline')" (click)="toggleHtmlClass('text-decoration-underline')"></jsf-kal-jsf-builder-action-bar-button>
      </ng-template>

      <mat-menu #headingMenu="matMenu">
          <button mat-menu-item (click)="setLevel(1)">1</button>
          <button mat-menu-item (click)="setLevel(2)">2</button>
          <button mat-menu-item (click)="setLevel(3)">3</button>
          <button mat-menu-item (click)="setLevel(4)">4</button>
          <button mat-menu-item (click)="setLevel(5)">5</button>
          <button mat-menu-item (click)="setLevel(6)">6</button>
      </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbHeadingComponent extends AbstractLayoutBuilderComponent {

  editMode = false;

  @Input()
  layoutEditor: JsfLayoutEditor;

  get level(): number {
    return this.layoutEditor.definitionWithoutItems.level || 1;
  }

  get title(): string {
    return this.layoutEditor.mutableDefinition.title || 'Heading';
  }

  setLevel(num: number) {
    this.layoutEditor.mutableDefinition.level = num;
    this.emitDefinitionChange();
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
