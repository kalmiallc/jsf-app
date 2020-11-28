import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Optional } from '@angular/core';
import { AbstractPropLayoutComponent }                                                    from '../abstract/prop-layout.component';
import { JsfPropBuilderObject, JsfPropLayoutBuilder }                                     from '@kalmia/jsf-common-es2015';
import { ShowValidationMessagesDirective }                                                from '../directives/show-validation-messages.directive';
import { BuilderDeveloperToolsInterface }                                                 from '../builder-developer-tools.interface';
import * as objectHash                                                                    from 'object-hash';
import { takeUntil }                                                                      from 'rxjs/operators';


@Component({
  selector       : 'jsf-prop-object',
  template       : `
      <div class="jsf-prop jsf-prop-object jsf-animatable" (click)="handleLayoutClick($event)" [ngClass]="htmlClass">
          <jsf-code-editor [language]="'json'" [(ngModel)]="json"></jsf-code-editor>

          <jsf-error-messages *ngIf="hasErrors" [messages]="interpolatedErrors"></jsf-error-messages>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class PropObjectComponent extends AbstractPropLayoutComponent<JsfPropBuilderObject> implements OnInit {

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

  @Input()
  developerTools?: BuilderDeveloperToolsInterface;

  constructor(protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective) {
    super(cdRef, showValidation);
  }

  ngOnInit() {
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
  }
}
