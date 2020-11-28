import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { JsfEditor }                                                                               from '@kalmia/jsf-common-es2015/lib/editor/jsf-editor';
import { Bind, JsfDocument }                                                                       from '@kalmia/jsf-common-es2015';
import { Subject }                                                                                 from 'rxjs';
import { BuilderPreferencesService }                                                               from '../builder-preferences.service';
import { takeUntil }                                                                               from 'rxjs/operators';
import { JSF_APP_CONFIG, JsfAppConfig }                                                        from '../../common';

@Component({
  selector       : 'jsf-kal-jsf-builder-export',
  templateUrl    : './kal-jsf-builder-export.component.html',
  styleUrls      : ['./kal-jsf-builder-export.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderExportComponent implements OnInit, OnDestroy {

  public doc = {
    schema: {
      type: 'object',
      properties: {
        definition: {
          type: 'string',
          handler: {
            type: 'common/code-editor',
            options: {
              language: 'json'
            }
          }
        }
      }
    },
    layout: {
      type: 'div',
      items: [
        {
          key: 'definition'
        }
      ]
    }
  };

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input()
  jsfEditor: JsfEditor;

  private _value: {
    definition: any
  };

  public get value(): { definition: any } {
    return this._value;
  }

  public set value(value: { definition: any }) {
    this._value = value;
    try {
      this.jsfEditor.jsfDefinition = JSON.parse(value.definition);
    } catch (e) {
      console.error(e);
    }
  }


  constructor(private builderPreferencesService: BuilderPreferencesService,
              @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig,
              private cdRef: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    this._value = {
      definition: JSON.stringify(this.jsfEditor.jsfDefinition, null, 2)
    };

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    try {
      this.jsfEditor.jsfDefinition = JSON.parse(this._value.definition);
    } catch (e) {
      console.error(e);
    }
  }
}
