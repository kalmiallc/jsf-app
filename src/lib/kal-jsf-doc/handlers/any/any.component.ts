import { ChangeDetectionStrategy, Component, Input, OnInit }                      from '@angular/core';
import { JsfHandlerBuilderComponent, JsfPropBuilderObject, JsfPropLayoutBuilder } from '@kalmia/jsf-common-es2015';
import { AbstractPropHandlerComponent }                                           from '../../abstract/handler.component';
import { takeUntil }                                                              from 'rxjs/operators';
import * as objectHash                                                            from 'object-hash';

@Component({
  selector       : 'app-jsf-any',
  template       : `
      <div class="handler-any jsf-animatable"
           [ngClass]="layoutSchema?.htmlClass || ''">

          <jsf-code-editor [language]="'json'" [(ngModel)]="json" [errorMessage]="errorMessage"></jsf-code-editor>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class AnyComponent extends AbstractPropHandlerComponent<JsfPropBuilderObject, JsfHandlerBuilderComponent> implements OnInit {

  private _hash: string;
  private _json: string;

  public errorMessage: string = null;

  public get json(): string {
    return this._json;
  }

  public set json(value: string) {
    this._json = value;

    let parsedValue;
    try {
      parsedValue = JSON.parse(this._json);
    } catch (e) {
      this.errorMessage = `Invalid JSON value`;
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
      return;
    }

    this._hash = objectHash.MD5(parsedValue);
    this.propBuilder.setJsonValue(parsedValue).catch(console.error);

    this.errorMessage = null;

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderObject>;


  ngOnInit(): void {
    super.ngOnInit();

    this.propBuilder.valueChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateValue();
      });

    this.updateValue();
  }

  private updateValue() {
    const { hash, value } = this.propBuilder.getJsonValueWithHash();
    if (!this._hash || this._hash !== hash) {
      // Update is required.
      this._json = JSON.stringify(value, null, 2);
      this._hash = hash;
    }

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

}
