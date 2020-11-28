import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  HandlerCompatibilityInterface,
  JsfAbstractPropEditor,
  JsfDefinition,
  JsfDocument,
  JsfEditor,
  JsfProp
}                                                                                                                    from '@kalmia/jsf-common-es2015';
import * as OverlayScrollbars
                                                                                                                     from 'overlayscrollbars';
import { MatDialog }                                                                                                 from '@angular/material/dialog';
import { KalJsfBuilderHandlerDialogComponent }                                                                       from '../kal-jsf-builder-common/kal-jsf-builder-handler-dialog/kal-jsf-builder-handler-dialog.component';
import { flattenDeep, mergeWith }                                                                                    from 'lodash';
import { mergeProps }                                                                                                from '../utils';
import { ModuleLoaderService }                                                                                       from '../../kal-jsf-doc/services/module-loader.service';
import { Observable }                                                                                                from 'rxjs';
import Color                                                                                                         from 'color';
import { jsfDefaultScrollOptions }                                                                                   from '../../utilities';
import { OverlayScrollbarsComponent }                                                                                from 'overlayscrollbars-ngx';
import { OverlayScrollbarsService }                                                                                  from '../../kal-jsf-doc/services/overlay-scrollbars.service';

interface SchemaDragAndDropNode {
  propEditor: JsfAbstractPropEditor<any>;
  childNodes: SchemaDragAndDropNode[];
  parentNode: SchemaDragAndDropNode;

  expanded?: boolean;
}

@Component({
  selector       : 'jsf-kal-jsf-builder-schema',
  templateUrl    : './kal-jsf-builder-schema.component.html',
  styleUrls      : ['./kal-jsf-builder-schema.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderSchemaComponent implements OnInit, OnDestroy, AfterViewInit {

  modulesLoaded = false;

  @Input()
  jsfEditor: JsfEditor;

  @ViewChild(OverlayScrollbarsComponent, { static: false })
  osComponent: OverlayScrollbarsComponent;

  @Input()
  private dataSourceListProvider: () => Observable<{ [key: string]: { title?: string } }>;

  @Input()
  private jsfDefinitionListProvider: () => Observable<{ [key: string]: { definition: JsfDefinition } }>;

  /**
   * Model data for ngx-dnd. No touchy.
   */
  public dragAndDropModel: SchemaDragAndDropNode[];


  readonly newPropDefinitions: { [k: string]: JsfProp } = {
    'object'    : { type: 'object', properties: {} },
    'array'     : {
      type: 'array', items: {
        type: 'object', properties: {}
      }
    },
    'fixedArray': { type: 'array', items: [] },
    'string'    : { type: 'string' },
    'number'    : { type: 'number' },
    'integer'   : { type: 'integer' },
    'boolean'   : { type: 'boolean' },
    'date'      : { type: 'date' },
    'binary'    : { type: 'binary' },
    'id'        : { type: 'id' }
  };

  public readonly scrollOptions: OverlayScrollbars.Options = {
    ...jsfDefaultScrollOptions,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    resize          : 'none',
    paddingAbsolute : true
  };

  selectedProp: {
    error?: string;
    id: string;
    prop: JsfAbstractPropEditor<any>,
    propertiesJsfDocument: JsfDocument;
    handlerTitle?: string;
    handlerCompatibility?: HandlerCompatibilityInterface;
    handlerJsfDocument?: JsfDocument;
  } = null;

  private _selectedPropValue: any;
  public get selectedPropValue(): any {
    return this._selectedPropValue;
  }

  public set selectedPropValue(value: any) {
    this._selectedPropValue = value;
    const prop              = this.jsfEditor.getPropById(this.selectedProp.id);
    mergeWith(prop.mutableDefinition, this._selectedPropValue, mergeProps);
  }

  private _selectedHandlerValue: any;
  public get selectedHandlerValue(): any {
    return this._selectedHandlerValue;
  }

  public set selectedHandlerValue(value: any) {
    this._selectedHandlerValue = value;
    const prop                 = this.jsfEditor.getPropById(this.selectedProp.id);
    if (prop.hasHandler) {
      mergeWith(prop.mutableDefinition.handler, this._selectedHandlerValue, mergeProps);
    }
  }


  constructor(private dialog: MatDialog,
              private cdRef: ChangeDetectorRef,
              private osService: OverlayScrollbarsService,
              private moduleLoaderService: ModuleLoaderService) {
  }

  async ngOnInit() {
    await this.moduleLoaderService.preloadAllHandlerModules();
    this.modulesLoaded = true;

    this.createDragAndDropModel();

    this.cdRef.detectChanges();
  }

  public ngAfterViewInit(): void {
    this.osService.registerOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }

  public ngOnDestroy(): void {
    this.osService.deregisterOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }

  getPropById(id: string) {
    return this.jsfEditor.getPropById(id);
  }

  /**
   * Creates drag and drop model from the schema editor.
   */
  private createDragAndDropModel() {
    this.dragAndDropModel = [];

    function getChildren(node: SchemaDragAndDropNode): SchemaDragAndDropNode[] {
      const propEditor = node.propEditor;

      if (!propEditor.canHaveChildren()) {
        return [];
      }

      return propEditor.children.map(x => {
        const n: SchemaDragAndDropNode = {
          propEditor: x,
          childNodes: [],
          parentNode: node,

          expanded: true
        };
        n.childNodes                   = getChildren(n);
        return n;
      });
    }

    const rootNode: SchemaDragAndDropNode = {
      propEditor: this.jsfEditor.schemaEditor,
      childNodes: [],
      parentNode: null,

      expanded: true
    };
    rootNode.childNodes                   = getChildren(rootNode);

    this.dragAndDropModel = [rootNode];

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  private flattenDragAndDropModelList(nodeList = this.dragAndDropModel): SchemaDragAndDropNode[] {
    return flattenDeep([
      ...nodeList.map(x => [x, this.flattenDragAndDropModelList(x.childNodes)])
    ]);
  }

  private getDragAndDropNodeById(id: string) {
    return this.flattenDragAndDropModelList()
      .find(x => x.propEditor.id === id);
  }

  toggleNodeExpanded(node: SchemaDragAndDropNode) {
    node.expanded = !node.expanded;
    this.cdRef.markForCheck();
  }

  nodeDropped(event: any) {
    const node       = event.value as SchemaDragAndDropNode;
    // We can find the new parent by searching the updated node tree; the update is done by the drag and drop library)
    const targetNode = this.flattenDragAndDropModelList().find(x => x.childNodes.indexOf(node) > -1);
    const index      = event.dropIndex;

    node.propEditor.moveTo(node.propEditor, targetNode.propEditor, targetNode.propEditor.isFixedArray ? index : void 0);
  }


  addPropChild(id: string, propDefinition: JsfProp) {
    propDefinition = JSON.parse(JSON.stringify(propDefinition));

    const parentProp = this.jsfEditor.getPropById(id);
    const propEditor = parentProp.createChild(propDefinition);

    // Add a node to the model
    const parentNode = this.getDragAndDropNodeById(parentProp.id);

    const node: SchemaDragAndDropNode = {
      propEditor,
      parentNode: parentNode,
      childNodes: [],

      expanded: true
    };

    parentNode.childNodes.push(node);

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  removeProp(propId: string) {
    const prop = this.jsfEditor.getPropById(propId);

    // Remove prop from the model
    const node            = this.getDragAndDropNodeById(prop.id);
    const parentNode      = this.getDragAndDropNodeById(prop.parent.id);
    parentNode.childNodes = parentNode.childNodes.filter(x => x !== node);

    // Destroy prop from schema editor
    prop.destroy();

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  openProperties(propId: string, forceOpen?: boolean) {
    console.log('[JSF-BUILDER] Open properties: ' + propId);
    const prop = this.jsfEditor.getPropById(propId);

    console.log('[JSF-BUILDER] Selected prop is now path: ' + prop.path);

    // Do not reselect the same prop
    if (this.selectedProp && this.selectedProp.id === propId && !forceOpen) {
      return;
    }

    this.jsfDefinitionListProvider()
      .subscribe(jsfDefinitions => {
        this.dataSourceListProvider()
          .subscribe(dataSources => {
            let handlerJsfDocument = prop.getHandlerForm();
            if (handlerJsfDocument) {
              handlerJsfDocument = {
                ...handlerJsfDocument,
                $config: {
                  builder: {
                    'jsf-definitions': jsfDefinitions,
                    'data-sources'   : dataSources
                  }
                }
              };
            }

            this.selectedProp = {
              id                   : prop.id,
              prop,
              propertiesJsfDocument: prop.getPropertiesForm(),
              handlerTitle         : prop.handlerTitle || prop.handlerType,
              handlerCompatibility : prop.getHandlerCompatibility(),
              handlerJsfDocument
            };

            console.log(this.selectedProp.handlerJsfDocument);

            this._selectedPropValue    = prop.mutableDefinition;
            this._selectedHandlerValue = prop.hasHandler ? prop.mutableDefinition.handler : void 0;
          });
      });

    this.cdRef.detectChanges();
  }

  selectHandler() {
    const selectedProp = this.jsfEditor.getPropById(this.selectedProp.id);

    const dialogRef = this.dialog.open(KalJsfBuilderHandlerDialogComponent, {
      data: {
        propType: selectedProp.editorType
      }
    });

    dialogRef.afterClosed()
      .subscribe((result: any) => {
        if (!result) {
          return;
        }

        if (this.selectedProp) {
          const prop = this.jsfEditor.getPropById(this.selectedProp.id);
          prop.setHandler(result);

          this.openProperties(this.selectedProp.id, true);

          this.cdRef.detectChanges();
        }
      });
  }

  setHandler(type: string) {
    if (!this.selectedProp) {
      return;
    }

    const prop = this.jsfEditor.getPropById(this.selectedProp.id);
    prop.setHandler(type);
  }

  removeHandler() {
    const prop = this.jsfEditor.getPropById(this.selectedProp.id);
    prop.removeHandler();

    this.openProperties(this.selectedProp.id, true);

    this.cdRef.detectChanges();
  }

  public isLightColor(color: string) {
    return Color(color).isLight();
  }

  public transparentize(color: string) {
    return Color(color).alpha(.2).rgb();
  }
}

