import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                         from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-row',
  template       : `
      <div class="jsf-lb-row" [ngClass]="getLayoutEditorClass()">
          <jsf-layout-builder-items-router
                  *ngIf="layoutEditor.supportsItems"
                  [parent]="layoutEditor"
                  [items]="layoutEditor.items"
                  [containerElementClass]="getLayoutClass()"
                  [containerItemElementClasses]="getLayoutItemClasses()">
          </jsf-layout-builder-items-router>
      </div>

      <ng-template #actionBarTemplate>
          <jsf-kal-jsf-builder-action-bar-button icon="view_column" [matMenuTriggerFor]="rowMenu"></jsf-kal-jsf-builder-action-bar-button>
      </ng-template>

      <mat-menu #rowMenu="matMenu">
          <button mat-menu-item (click)="setNumOfCols(1)">1</button>
          <button mat-menu-item (click)="setNumOfCols(2)">2</button>
          <button mat-menu-item (click)="setNumOfCols(3)">3</button>
          <button mat-menu-item (click)="setNumOfCols(4)">4</button>
          <button mat-menu-item (click)="setNumOfCols(5)">5</button>
          <button mat-menu-item (click)="setNumOfCols(6)">6</button>
          <button mat-menu-item (click)="setNumOfCols(7)">7</button>
          <button mat-menu-item (click)="setNumOfCols(8)">8</button>
          <button mat-menu-item (click)="setNumOfCols(9)">9</button>
          <button mat-menu-item (click)="setNumOfCols(10)">10</button>
          <button mat-menu-item (click)="setNumOfCols(11)">11</button>
          <button mat-menu-item (click)="setNumOfCols(12)">12</button>
      </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbRowComponent extends AbstractLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

  private readonly breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];

  setNumOfCols(colsNum: number) {
    if (this.layoutEditor.items.length > colsNum) {
      for (let i = this.layoutEditor.items.length - colsNum; i > 0; i--) {
        for (let j = 0; j < this.layoutEditor.items[this.layoutEditor.items.length - i].items.length; j++) {
          this.layoutEditor
            .items[this.layoutEditor.items.length - i]
            .items[j]
            .moveTo(this.layoutEditor.items[0]);
        }
        this.layoutEditor.items[this.layoutEditor.items.length - i].destroy();
      }
    } else if (this.layoutEditor.items.length < colsNum) {
      for (let i = colsNum - this.layoutEditor.items.length; i > 0; i--) {
        this.layoutEditor.createItem({ 'type': 'col', 'items': [] } as any);
      }
    }
  }

  getLayoutClass(): string {
    const classNames = ['row'];

    // Gutters
    if (this.layout.gutters !== undefined && this.layout.gutters === false) {
      classNames.push('no-gutters');
    }

    // Horizontal alignment
    if (this.layout.horizontalAlign) {
      classNames.push(`justify-content-${ this.layout.horizontalAlign }`);
    }

    // Vertical alignment
    if (this.layout.verticalAlign) {
      classNames.push(`align-items-${ this.layout.verticalAlign }`);
    }

    return classNames.join(' ');
  }

  getLayoutItemClasses(): string[] {
    const classes: string[] = [];

    for (const item of this.layoutEditor.items) {
      const classNames = [];
      const itemLayout = item.definitionWithoutItems;

      if (item.type === 'col') {
        // Size
        let anySizeSpecified = false;
        for (const breakpoint of this.breakpoints) {
          const value = itemLayout[breakpoint];
          if (value) {
            switch (value) {
              case 'auto':
                classNames.push(`col${ infix(breakpoint) } d${ infix(breakpoint) }-initial`);
                anySizeSpecified = true;
                break;
              case 'content':
                classNames.push(`col${ infix(breakpoint) }-auto d${ infix(breakpoint) }-initial`);
                anySizeSpecified = true;
                break;
              case 'none':
                classNames.push(`d${ infix(breakpoint) }-none`);
                anySizeSpecified = true;
                break;
              default:
                classNames.push(`col${ infix(breakpoint) }-${ value } d${ infix(breakpoint) }-initial`);
                anySizeSpecified = true;
                break;
            }
          }
        }
        // Add a default `col` class is no size was specified on the layout
        if (!anySizeSpecified) {
          classNames.push(`col`);
        }

        // Offset
        if (itemLayout.offset) {
          for (const breakpoint of this.breakpoints) {
            const value = itemLayout.offset[breakpoint];
            if (value !== undefined) {
              classNames.push(`offset${ infix(breakpoint) }-${ value }`);
            }
          }
        }

        // Order
        if (itemLayout.order) {
          switch (itemLayout.order) {
            case 'first':
              classNames.push(`order-first`);
              break;
            case 'last':
              classNames.push(`order-last`);
              break;
            default:
              for (const breakpoint of this.breakpoints) {
                const value = itemLayout.order[breakpoint];
                if (value) {
                  classNames.push(`order${ infix(breakpoint) }-${ value }`);
                }
              }
              break;
          }
        }

        // Vertical alignment
        if (itemLayout.verticalAlign) {
          classNames.push(`align-self-${ itemLayout.verticalAlign }`);
        }
      }

      // Add outer classes
      classNames.push(itemLayout.htmlClass);

      classes.push(classNames.join(' '));
    }

    return classes;
  }
}

function infix(breakpoint: string): string {
  return breakpoint === 'xs' ? '' : `-${ breakpoint }`;
}

