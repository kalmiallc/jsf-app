import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                                from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                 from '../../../abstract/abstract-layout-builder.component';
import Color                                                                              from 'color';
import { takeUntil }                                                                      from 'rxjs/operators';


@Component({
  selector       : 'jsf-lb-badge',
  template       : `
      <div class="jsf-lb-badge jsf-layout-badge" [ngClass]="getLayoutEditorClass()">
          <div class="jsf-layout-badge-background rounded"
               [class.__background-color--primary-20]="!backgroundColor || backgroundColor === 'primary'"
               [class.__background-color--accent-20]="backgroundColor === 'accent'"
               [class.__background-color--warn-20]="backgroundColor === 'warn'"
               [ngStyle]="{'background-color': backgroundColor }">
              <div class="jsf-layout-badge-content"
                   [class.__color--primary]="!color || color === 'primary'"
                   [class.__color--accent]="color === 'accent'"
                   [class.__color--warn]="color === 'warn'"
                   [ngStyle]="{'color': color }">
                  <span>{{ title }}</span>
              </div>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
      `
          .jsf-layout-badge {
              display: inline-block;
          }

          .jsf-layout-badge-background {
              display:    inline-block;
              padding:    .2rem .8rem;
              transition: background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          .jsf-layout-badge-content {
              transition: color 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
          }`
  ]
})
export class LbBadgeComponent extends AbstractLayoutBuilderComponent implements OnInit {

  @Input()
  layoutEditor: JsfLayoutEditor;

  private _color: string;
  private _backgroundColor: string;

  get title() {
    return this.layout.title;
  }

  get color(): string {
    return this._color;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }


  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.layoutEditor.updateLayout$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.getColor();
      });
  }

  private getColor() {
    try {
      if (!this.layout.color || this.isEvalObject(this.layout.color)) {
        // It is impossible to determine the color in case of an eval, so just display it as primary.
        this._color           = 'primary';
        this._backgroundColor = 'primary';
      } else {
        if (this.layout.color === 'primary' || this.layout.color === 'accent' || this.layout.color === 'warn') {
          this._color           = this.layout.color;
          this._backgroundColor = this.layout.color;
        } else {
          this._color           = this.layout.color && Color(this.layout.color).rgb().string();
          this._backgroundColor = this.layout.color && Color(this.layout.color).alpha(.2).rgb().string();
        }
      }
    } catch (e) {
      this._color           = 'primary';
      this._backgroundColor = 'primary';
    } finally {
      this.cdRef.detectChanges();
    }
  }

  private isEvalObject(x: any): x is { $eval: string, dependencies?: string[] } {
    return typeof x === 'object' && '$eval' in x;
  }
}
