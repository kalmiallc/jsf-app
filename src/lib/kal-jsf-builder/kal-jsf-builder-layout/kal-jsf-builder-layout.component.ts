import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { JsfDocument, JsfEditor, JsfLayoutEditor, JsfRegister, LayoutInfoInterface }               from '@kalmia/jsf-common-es2015';
import { mergeWith, uniq }                                                                         from 'lodash';
import * as OverlayScrollbars                                                                      from 'overlayscrollbars';
import { DragDropService }                                                                         from './drag-drop.service';
import { BuilderPreferencesService }                                                               from '../builder-preferences.service';
import { Subject, Subscription }                                                                   from 'rxjs';
import { takeUntil }                                                                               from 'rxjs/operators';
import { BuilderActionBarService }                                                                 from './builder-action-bar.service';
import { propKeyJsfSchema }                                                                        from './prop-key.jsf';
import { mergeProps }                                                                              from '../utils';
import { JSF_APP_CONFIG, JsfAppConfig }                                                            from '../../common';
import { ShortcutEventOutput, ShortcutInput }                                                      from 'ng-keyboard-shortcuts';
import { BuilderNotificationService }                                                              from '../builder-notification.service';

interface StoreItemDef {
  info: LayoutInfoInterface;
  type: string;
  name: string;
  category: string;
}

@Component({
  selector       : 'jsf-kal-jsf-builder-layout',
  templateUrl    : './kal-jsf-builder-layout.component.html',
  styleUrls      : ['./kal-jsf-builder-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderLayoutComponent implements OnInit, OnDestroy {

  assetsBasePath = './assets/builder/';

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  selectedSidebarIndex                 = 0;

  public readonly scrollOptions: OverlayScrollbars.Options = {
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    resize          : 'none',
    paddingAbsolute : true
  };

  selectedSubscription: Subscription;
  definitionUpdateSubscription: Subscription;

  keyboardShortcuts: ShortcutInput[];


  /**
   * Search by ...
   */
  layoutToolboxSearch: string;

  /**
   * Selected layout
   */
  selectedLayout: {
    error?: string;
    id: string;
    propertiesJsfDocument: JsfDocument;
  } = null;

  private _selectedLayoutValue: any;
  public get selectedLayoutValue(): any {
    return this._selectedLayoutValue;
  }

  public set selectedLayoutValue(value: any) {
    this._selectedLayoutValue = value;
    if (this.actionBarService.selected) {
      mergeWith(this.actionBarService.selected.mutableDefinition, this._selectedLayoutValue, mergeProps);
      // console.log(this.actionBarService.selected.mutableDefinition);
      this.actionBarService.selected.updateLayout$.next();
    }
  }

  /**
   * Selected prop
   */
  selectedProp: {
    error?: string;
    key: string;
    id: string;
    propertiesJsfDocument: JsfDocument;
    handlerLayoutJsfDocument: JsfDocument;
  } = null;

  private _selectedPropValue: any;
  public get selectedPropValue(): any {
    return this._selectedPropValue;
  }

  public set selectedPropValue(value: any) {
    this._selectedPropValue = value;
    mergeWith(this.actionBarService.selected.mutableDefinition, this._selectedPropValue, mergeProps);
    if ('key' in value) {
      const oldKey                       = this.actionBarService.selected.key;
      this.actionBarService.selected.key = value.key;
      if (oldKey !== value.key) {
        this.selectLayout(this.actionBarService.selected);
      }
    }
    // console.log(this.actionBarService.selected.mutableDefinition);
    this.actionBarService.selected.updateLayout$.next();
  }

  private _selectedPropHandlerLayoutValue: any;
  public get selectedPropHandlerLayoutValue(): any {
    return this._selectedPropHandlerLayoutValue;
  }

  public set selectedPropHandlerLayoutValue(value: any) {
    this._selectedPropHandlerLayoutValue = value;
    mergeWith(this.actionBarService.selected.mutableDefinition, this._selectedPropHandlerLayoutValue, mergeProps);
    // console.log(this.actionBarService.selected.mutableDefinition);
    this.actionBarService.selected.updateLayout$.next();
  }


  @Input()
  jsfEditor: JsfEditor;

  @Input()
  availableLayoutModes?: string[] = [];


  public get deviceSize(): 'desktop' | 'tablet' | 'mobile' {
    return this.builderPreferencesService.get('device-size', 'desktop');
  }

  public get layoutPaddingEnabled(): boolean {
    return this.builderPreferencesService.get('layout-padding-enabled');
  }

  public get layoutBordersEnabled(): boolean {
    return this.builderPreferencesService.get('layout-borders-enabled');
  }


  public readonly layoutCategories: string[] = [];
  public readonly layoutTypesByCategory: { [category: string]: StoreItemDef[] };

  constructor(private dragDropService: DragDropService,
              private builderPreferencesService: BuilderPreferencesService,
              private actionBarService: BuilderActionBarService,
              private builderNotificationService: BuilderNotificationService,
              @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig,
              private cdRef: ChangeDetectorRef) {
    if (jsfAppConfig.builder?.assetsBasePath) {
      this.assetsBasePath = jsfAppConfig.builder.assetsBasePath;
    }

    let layoutInfos = JsfRegister.listLayouts()
      .map(x => JsfRegister.getLayoutInfo(x));

    // If a whitelist was provided, filter out the unavailable layouts from the toolbox.
    const layoutsWhitelist = JsfRegister.getToolboxLayoutWhitelist();
    if (layoutsWhitelist) {
      layoutInfos = layoutInfos.filter(x => layoutsWhitelist.indexOf(x.type) > -1);
    }

    this.layoutCategories      = uniq(layoutInfos.map(x => x.category));
    this.layoutTypesByCategory = this.layoutCategories.reduce((acc, x) => {
      return {
        ...acc,
        [x]: layoutInfos.filter(y => y.category === x).map(y => ({
          info: y,

          name    : y.title,
          category: y.category,
          type    : y.type
        } as StoreItemDef))
      };
    }, {});

    this.selectedSubscription = actionBarService.selected$.subscribe(() => {
      this.selectLayout(this.actionBarService.selected);
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.builderPreferencesService.update$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.cdRef.detectChanges());

    this.registerKeyboardShortcuts();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.selectedSubscription.unsubscribe();

    this.actionBarService.deselect();
  }

  toolboxDropStart(event: any) {
    this.dragDropService.start(this.jsfEditor, event.value);
  }

  toolboxDropCancel(event: any) {
    this.dragDropService.stop(this.jsfEditor);
  }

  getLayoutTypesByCategory(category: string) {
    return this.layoutTypesByCategory[category]
      .filter(item =>
        [item.name, item?.info?.title, item.type]
          .some(x => !!x && new RegExp(this.layoutToolboxSearch, 'gi').test(x))
      );
  }

  private selectLayout(layout: JsfLayoutEditor) {
    if (layout) {
      // Layout was selected
      if (this.definitionUpdateSubscription) {
        this.definitionUpdateSubscription.unsubscribe();
        this.definitionUpdateSubscription = void 0;
      }

      // Subscribe to definition change
      this.definitionUpdateSubscription = layout.definitionChange$.subscribe(() => {
        if (this.selectedLayout) {
          this._selectedLayoutValue = layout.mutableDefinition;
          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        }
      });

      // Special case for expansion panel and table items: display them as props.
      const isSpecialArrayLayoutItem = ['array', 'table', 'expansion-panel'].indexOf(layout.type) > -1;

      const layoutType = layout.type;
      if (!layoutType || isSpecialArrayLayoutItem) {
        // Prop
        let key, prop;
        try {
          prop = this.jsfEditor.getProp(layout.mutableDefinition.key);
        } catch (e) {
          // This is fine
          console.error(e);
        }
        if (prop) {
          key = prop.path;
        }

        this.selectedProp                    = {
          key,
          id                      : prop?.id,
          propertiesJsfDocument   : {
            ...(propKeyJsfSchema(this.jsfEditor.getAllPropPaths().filter(x => !!x)))
          },
          handlerLayoutJsfDocument: prop?.getHandlerLayoutForm()
        };
        this._selectedPropValue              = { key };
        this._selectedPropHandlerLayoutValue = layout.mutableDefinition;

        const propertiesForm = prop && (isSpecialArrayLayoutItem
          ? JsfRegister.getLayoutFormDefinition(layoutType)
          : JsfRegister.getLayoutFormDefinition(`@prop/${ prop.editorType }`));

        this.selectedLayout       = {
          id                   : layout.id,
          propertiesJsfDocument: propertiesForm
        };
        this._selectedLayoutValue = layout.mutableDefinition;

      } else {
        // Layout
        this.selectedLayout       = {
          id                   : layout.id,
          propertiesJsfDocument: layout.getPropertiesForm()
        };
        this._selectedLayoutValue = layout.mutableDefinition;
      }
      this.selectedSidebarIndex = 1;

    } else {
      this.selectedLayout       = null;
      this.selectedProp         = null;
      this.selectedSidebarIndex = 0;
    }
  }

  private registerKeyboardShortcuts() {
    this.keyboardShortcuts = [
      // Duplicate
      {
        key           : ['ctrl + d'],
        command       : (event: ShortcutEventOutput) => {
          const selected = this.actionBarService.selected;
          if (selected) {
            try {
              selected.parent.createItem(selected.getDefinition(), selected.index + 1);
              this.builderNotificationService.showQuickActionNotification(`Layout "${ selected.type }" duplicated.`);
            } catch (e) {
              this.builderNotificationService.showQuickActionNotification(e);
            }
          }
        },
        preventDefault: true
      },
      // Cut
      {
        key           : ['ctrl + x'],
        command       : (event: ShortcutEventOutput) => {
          const selected = this.actionBarService.selected;
          if (selected) {
            this.builderPreferencesService.set('builder-clipboard', {
              type      : 'layout-item',
              definition: selected.getDefinition()
            });
            this.actionBarService.deselect();
            selected.remove();
            this.builderNotificationService.showQuickActionNotification(`Layout "${ selected.type }" cut.`);
          }
        },
        preventDefault: true
      },
      // Copy
      {
        key           : ['ctrl + c'],
        command       : (event: ShortcutEventOutput) => {
          const selected = this.actionBarService.selected;
          if (selected) {
            this.builderPreferencesService.set('builder-clipboard', {
              type      : 'layout-item',
              definition: selected.getDefinition()
            });
            this.builderNotificationService.showQuickActionNotification(`Layout "${ selected.type }" copied.`);
          }
        },
        preventDefault: true
      },
      // Paste
      {
        key           : ['ctrl + v'],
        command       : (event: ShortcutEventOutput) => {
          const selected = this.actionBarService.selected;
          if (selected) {
            if (!selected.supportsItems) {
              return this.builderNotificationService.showQuickActionNotification('Selected layout does not support child items.');
            }
            const copiedValue = this.builderPreferencesService.get('builder-clipboard');
            if (copiedValue.type === 'layout-item') {
              try {
                const item = selected.createItem(copiedValue.definition);
                this.builderNotificationService.showQuickActionNotification(`Layout "${ item.type }" pasted.`);
              } catch (e) {
                this.builderNotificationService.showQuickActionNotification(e);
              }
            }
          }
        },
        preventDefault: true
      },
      // Delete
      {
        key           : ['del'],
        command       : (event: ShortcutEventOutput) => {
          const selected = this.actionBarService.selected;
          if (selected) {
            this.actionBarService.deselect();
            selected.remove();
            this.builderNotificationService.showQuickActionNotification(`Layout "${ selected.type }" deleted.`);
          }
        },
        preventDefault: true
      },
    ];
  }
}
