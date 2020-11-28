import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  DataSourceProviderRequestInterface,
  DataSourceProviderResponseInterface,
  isBindable,
  JsfDefinition,
  JsfDocument,
  JsfEditor,
  JsfRegister,
  Language,
  TranslatedMessage
}                                                                                                                from '@kalmia/jsf-common-es2015';
import { Observable, of, Subject }                                                                               from 'rxjs';
import { BuilderPreferencesService }                                                                             from './builder-preferences.service';
import { BuilderStateService }                                                                                   from './builder-state.service';
import {
  AllowIn, ShortcutEventOutput,
  ShortcutInput
} from 'ng-keyboard-shortcuts';

export enum BuilderTab {
  Config       = 'config',
  Layout       = 'layout',
  Schema       = 'schema',
  Preview      = 'preview',
  Translations = 'translations',
  Export       = 'export'
}

export interface BuilderOutputInterface {
  jsfEditor: JsfEditor;

  definition: JsfDefinition;
  translations: { [languageCode: string]: TranslatedMessage[] };

  initialStateHash: string;
  currentStateHash: string;
  hasStateChanged: boolean;
}

@Component({
  selector       : 'jsf-kal-jsf-builder',
  templateUrl    : './kal-jsf-builder.component.html',
  styleUrls      : ['./kal-jsf-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderComponent implements OnInit, OnDestroy {

  BuilderTabEnum = BuilderTab;


  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input()
  jsfDefinition?: JsfDocument;

  @Input()
  translations?: { [languageCode: string]: TranslatedMessage[] };

  @Input()
  jsfEditor?: JsfEditor;

  /**
   * Active modes for preview tab.
   */
  @Input()
  modes?: string[] = [];


  @Input()
  dataSourceConfig?: any;

  /**
   * Available list of modes for use in layout builder.
   */
  @Input()
  availableLayoutModes?: string[] = [];

  @Input()
  translationLanguages?: Language[];

  @Input()
  key?: string;


  /**
   * Customization
   */
  @Input()
  editorLogoSrc?: string;

  @Input()
  editorTitle?: string;


  /**
   * Outputs
   */
  @Output()
  save   = new EventEmitter<BuilderOutputInterface>();
  @Output()
  saveAs = new EventEmitter<BuilderOutputInterface>();
  @Output()
  delete = new EventEmitter<void>();
  @Output()
  close  = new EventEmitter<void>();

  keyboardShortcuts: ShortcutInput[];

  private _selectedLayoutModes: string[] = [];
  public get selectedLayoutModes(): string[] {
    return this._selectedLayoutModes;
  }

  public set selectedLayoutModes(value: string[]) {
    this._selectedLayoutModes = value;
    if (this.builderPreferencesService) {
      this.builderPreferencesService.set('editor-selected-layout-modes', value);
    }
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }


  private _selectedTab: BuilderTab;
  public get selectedTab(): BuilderTab {
    return this._selectedTab;
  }

  public set selectedTab(value: BuilderTab) {
    this._selectedTab = value;
    if (this.builderPreferencesService) {
      this.builderPreferencesService.set('editor-active-tab', value);
    }
  }

  /**
   * Called when the application should load data source with specific filters
   */
  private _dataSourceProvider?: (req: DataSourceProviderRequestInterface) => Observable<DataSourceProviderResponseInterface>;
  @Input()
  get dataSourceProvider() {
    return this._dataSourceProvider;
  }

  set dataSourceProvider(value: (req: DataSourceProviderRequestInterface) => Observable<DataSourceProviderResponseInterface>) {
    if (value && isBindable(value)) {
      throw new Error(`Provided method for 'dataSourceProvider' is not bound to parent context. Try using the @Bind() decorator.`);
    }
    this._dataSourceProvider = value;
  }

  /**
   * Called when the application should load data source with specific filters
   */
  private _jsfDefinitionProvider?: (key: string) => Observable<JsfDefinition>;
  @Input()
  get jsfDefinitionProvider() {
    return this._jsfDefinitionProvider;
  }

  set jsfDefinitionProvider(value: (key: string) => Observable<JsfDefinition>) {
    if (value && isBindable(value)) {
      throw new Error(`Provided method for 'jsfDefinitionProvider' is not bound to parent context. Try using the @Bind() decorator.`);
    }
    this._jsfDefinitionProvider = value;
  }

  /**
   * Called when picking data source for component
   */
  private _dataSourceListProvider: () => Observable<{ [key: string]: { title?: string } }> = () => of({});
  @Input()
  get dataSourceListProvider() {
    return this._dataSourceListProvider;
  }

  set dataSourceListProvider(value: () => Observable<{ [key: string]: { title?: string } }>) {
    if (value && isBindable(value)) {
      throw new Error(`Provided method for 'dataSourceListProvider' is not bound to parent context. Try using the @Bind() decorator.`);
    }
    this._dataSourceListProvider = value;
  }

  /**
   * Called when picking jsf def. for component
   */
  private _jsfDefinitionListProvider: () => Observable<{ [key: string]: { definition: JsfDefinition } }> = () => of({});
  @Input()
  get jsfDefinitionListProvider() {
    return this._jsfDefinitionListProvider;
  }

  set jsfDefinitionListProvider(value: () => Observable<{ [key: string]: { definition: JsfDefinition } }>) {
    if (value && isBindable(value)) {
      throw new Error(`Provided method for 'jsfDefinitionListProvider' is not bound to parent context. Try using the @Bind() decorator.`);
    }
    this._jsfDefinitionListProvider = value;
  }


  get title() {
    return this.jsfEditor?.definitionConfig.$title;
  }

  /**
   * Device size.
   */
  public get deviceSize(): 'desktop' | 'tablet' | 'mobile' {
    return this.builderPreferencesService.get('device-size', 'desktop');
  }

  public set deviceSize(value: 'desktop' | 'tablet' | 'mobile') {
    this.builderPreferencesService.set('device-size', value);
  }

  /**
   * Layout padding.
   */
  public get layoutPaddingEnabled(): boolean {
    return this.builderPreferencesService.get('layout-padding-enabled');
  }

  public set layoutPaddingEnabled(value: boolean) {
    this.builderPreferencesService.set('layout-padding-enabled', value);
  }

  /**
   * Layout borders.
   */
  public get layoutBordersEnabled(): boolean {
    return this.builderPreferencesService.get('layout-borders-enabled');
  }

  public set layoutBordersEnabled(value: boolean) {
    this.builderPreferencesService.set('layout-borders-enabled', value);
  }


  constructor(public cdRef: ChangeDetectorRef,
              private builderPreferencesService: BuilderPreferencesService,
              private builderStateService: BuilderStateService) {
  }

  public ngOnInit(): void {
    (window as any).JsfRegister = JsfRegister;

    this.builderPreferencesService.loadFromLocalStorage();
    this.builderStateService.clear();

    this._selectedTab = this.builderPreferencesService.get('editor-active-tab', BuilderTab.Layout);
    this._selectedLayoutModes = this.builderPreferencesService.get('editor-selected-layout-modes', []);

    // Filter out any selected modes that do not exist anymore, in case a mode is added or removed.
    this._selectedLayoutModes = this._selectedLayoutModes.filter(x => this.availableLayoutModes.indexOf(x) > -1);
    this.selectedLayoutModes = this._selectedLayoutModes;


    if (!this.jsfEditor) {
      this.jsfEditor = new JsfEditor({
        jsfDefinition: this.jsfDefinition,
        translations : this.translations
      });
    }

    if (!this.jsfEditor) {
      throw new Error('[JSF-BUILDER] Input jsfEditor or jsfDefinition is required.');
    }

    console.log('[DEBUG] Jsf editor instance', this.jsfEditor);
    (window as any)._jsfEditor = this.jsfEditor;

    this.registerKeyboardShortcuts();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    (window as any)._jsfEditor = void 0;
  }

  public setDeviceSize(size: 'desktop' | 'tablet' | 'mobile') {
    this.deviceSize = size;
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public toggleLayoutPadding() {
    this.layoutPaddingEnabled = !this.layoutPaddingEnabled;
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public toggleLayoutBorders() {
    this.layoutBordersEnabled = !this.layoutBordersEnabled;
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public setSelectedMode(mode: string, value: boolean) {
    if (!value) {
      this.selectedLayoutModes = this.selectedLayoutModes.filter(x => x !== mode);
    } else {
      this.selectedLayoutModes = [ ...this.selectedLayoutModes, mode ];
    }
  }

  public hasSelectedMode(mode: string) {
    return this.selectedLayoutModes.indexOf(mode) > -1;
  }

  selectTab(tabIndex: BuilderTab) {
    this.selectedTab = tabIndex;
  }

  closeClick() {
    this.close.emit();
  }

  saveClick() {
    this.save.emit(this.getOutputData());
  }

  saveAsClick() {
    this.saveAs.emit(this.getOutputData());
  }

  deleteClick() {
    this.delete.emit();
  }

  private getOutputData(): BuilderOutputInterface {
    const initialStateHash = this.jsfEditor.getInitialStateHash();
    const currentStateHash = this.jsfEditor.getCurrentStateHash();

    return {
      jsfEditor: this.jsfEditor,

      definition  : this.jsfEditor.jsfDefinition,
      translations: this.jsfEditor.translations,

      initialStateHash,
      currentStateHash,
      hasStateChanged: initialStateHash === currentStateHash
    };
  }

  private registerKeyboardShortcuts() {
    this.keyboardShortcuts = [
      {
        key: 'ctrl + s',
        command: (event: ShortcutEventOutput) => {
          this.saveClick();
        },
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Select, AllowIn.Input]
      },
      {
        key: 'ctrl + shift + s',
        command: (event: ShortcutEventOutput) => {
          this.saveAsClick();
        },
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Select, AllowIn.Input]
      }
    ];
  }
}
