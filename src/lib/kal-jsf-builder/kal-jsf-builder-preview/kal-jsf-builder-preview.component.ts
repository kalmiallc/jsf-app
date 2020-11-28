import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Bind,
  DataSourceProviderRequestInterface,
  DataSourceProviderResponseInterface,
  JsfDefinition,
  JsfEditor,
  JsfPageBuilder
}                                                                                                  from '@kalmia/jsf-common-es2015';
import {
  Observable,
  Subject
}                                                                                                  from 'rxjs';
import { BuilderPreferencesService }                                                               from '../builder-preferences.service';
import { takeUntil }                                                                               from 'rxjs/operators';
import {
  JSF_APP_CONFIG,
  JsfAppConfig
}                                                                                                  from '../../common';
import { BuilderStateService }                                                                     from '../builder-state.service';


@Component({
  selector       : 'jsf-kal-jsf-builder-preview',
  templateUrl    : './kal-jsf-builder-preview.component.html',
  styleUrls      : ['./kal-jsf-builder-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderPreviewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private _availableDataSources;

  public toolboxFormDoc;
  private _toolboxFormValue = {
    dataSources       : [],
    dataSourcesFilters: []
  };
  public get toolboxFormValue(): { dataSourcesFilters: any[]; dataSources: any[] } {
    return this._toolboxFormValue;
  }

  public set toolboxFormValue(value: { dataSourcesFilters: any[]; dataSources: any[] }) {
    this._toolboxFormValue = value;
    this.builderStateService.set('builder-preview-data-sources-toolbox-value', value);
    this.createPage();
  }

  @Input()
  jsfEditor: JsfEditor;

  @Input()
  modes?: string[] = [];

  // jsfEditorDocument: JsfDocument;
  jsfPageBuilder: JsfPageBuilder;

  // TMP fix
  jsfPageBuilders: JsfPageBuilder[] = [];

  proxyRendering = true;
  themeRendering = true;

  @Input()
  dataSourceListProvider?: () => Observable<{ [key: string]: { title?: string } }>;

  @Input()
  jsfDefinitionListProvider?: () => Observable<{ [key: string]: { definition: JsfDefinition } }>;

  @Input()
  dataSourceProvider?: (req: DataSourceProviderRequestInterface) => Observable<DataSourceProviderResponseInterface>;

  @Input()
  dataSourceConfig?: any;

  @Input()
  jsfDefinitionProvider?: (key: string) => Observable<JsfDefinition>;

  /**
   * Device size.
   */
  public get deviceSize(): 'desktop' | 'tablet' | 'mobile' {
    return this.builderPreferencesService.get('device-size', 'desktop');
  }

  constructor(private builderPreferencesService: BuilderPreferencesService,
              @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig,
              private builderStateService: BuilderStateService,
              private cdRef: ChangeDetectorRef) {
    this.themeRendering = !this.jsfAppConfig.builder?.disablePreviewThemeRendering;
    this.proxyRendering = !this.jsfAppConfig.builder?.disableProxyPreviewRendering;
  }


  ngOnInit(): void {
    this.builderPreferencesService.update$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.cdRef.detectChanges());

    this.dataSourceListProvider()
      .subscribe(dataSources => {
        this._availableDataSources = dataSources;

        this.createToolboxForm();
        this.createPage();
      });
  }

  createPage() {
    const dataSourceFilters = this._toolboxFormValue?.dataSourcesFilters
      ? this._toolboxFormValue.dataSourcesFilters.filter(x => {
        return x.dataSource && x.filterPath;
      })
      : [];

    console.log(this.jsfEditor.jsfDefinition);
    this.jsfPageBuilder = new JsfPageBuilder({
      component: {
        dataSources       : this._toolboxFormValue?.dataSources || [],
        dataSourcesFilters: dataSourceFilters,
        jsfDefinition     : this.jsfEditor.jsfDefinition,
        innerScroll       : true
      }
    }, {
      dataSourceConfig     : this.dataSourceConfig || {},
      dataSourceProvider   : req => this.dataSourceProvider(req),
      jsfDefinitionProvider: key => this.jsfDefinitionProvider(key)
    });

    this.jsfPageBuilders = [this.jsfPageBuilder];

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  createToolboxForm() {
    this.toolboxFormDoc = {
      schema: {
        type      : 'object',
        properties: {
          dataSources       : {
            type : 'array',
            items: {
              type      : 'object',
              properties: {
                key: {
                  type   : 'string',
                  title  : 'Data source',
                  handler: {
                    type  : 'common/dropdown',
                    values: Object.keys(this._availableDataSources).map(x => ({
                      value: x,
                      label: this._availableDataSources[x].title
                    }))
                  }
                }
              }
            }
          },
          dataSourcesFilters: {
            type : 'array',
            items: {
              type      : 'object',
              properties: {
                dataSource: {
                  type   : 'string',
                  title  : 'Data source',
                  handler: {
                    type  : 'common/dropdown',
                    values: Object.keys(this._availableDataSources).map(x => ({
                      value: x,
                      label: this._availableDataSources[x].title
                    }))
                  }
                },
                filterPath: {
                  type : 'string',
                  title: 'Filter path'
                }
              }
            }
          }
        }
      },
      layout: {
        type : 'div',
        items: [
          {
            type     : 'span',
            title    : 'Data sources',
            htmlClass: 'font-weight-bold'
          },
          {
            key  : 'dataSources',
            type : 'array',
            items: [
              {
                type : 'div',
                items: [
                  {
                    type : 'row',
                    items: [
                      {
                        type : 'col',
                        xs   : 10,
                        items: [
                          {
                            key: 'dataSources[].key'
                          }
                        ]
                      },
                      {
                        type : 'col',
                        xs   : 2,
                        items: [
                          {
                            type       : 'array-item-remove',
                            icon       : 'delete',
                            preferences: {
                              variant: 'icon'
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type       : 'button',
            icon       : 'add',
            preferences: {
              variant: 'icon'
            },
            onClick    : {
              arrayItemAdd: {
                path: 'dataSources'
              }
            }
          },
          {
            type     : 'span',
            title    : 'Data source filters',
            htmlClass: 'd-block mt-5 font-weight-bold'
          },
          {
            key  : 'dataSourcesFilters',
            type : 'array',
            items: [
              {
                type : 'div',
                items: [
                  {
                    type : 'row',
                    items: [
                      {
                        type : 'col',
                        xs   : 10,
                        items: [
                          {
                            type : 'row',
                            items: [
                              {
                                type : 'col',
                                xs   : 6,
                                items: [
                                  {
                                    key: 'dataSourcesFilters[].dataSource'
                                  }
                                ]
                              },
                              {
                                type : 'col',
                                xs   : 6,
                                items: [
                                  {
                                    key: 'dataSourcesFilters[].filterPath'
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        type : 'col',
                        xs   : 2,
                        items: [
                          {
                            type       : 'array-item-remove',
                            icon       : 'delete',
                            preferences: {
                              variant: 'icon'
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type       : 'button',
            icon       : 'add',
            preferences: {
              variant: 'icon'
            },
            onClick    : {
              arrayItemAdd: {
                path: 'dataSourcesFilters'
              }
            }
          }
        ]
      }
    };

    this._toolboxFormValue = this.builderStateService.get('builder-preview-data-sources-toolbox-value');

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  @Bind()
  jsfError() {
  }

  @Bind()
  jsfBuilder() {
  }

}
