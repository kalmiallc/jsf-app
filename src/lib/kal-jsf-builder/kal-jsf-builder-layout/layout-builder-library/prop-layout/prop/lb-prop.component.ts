import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injector,
  Input,
  NgModuleFactoryLoader,
  OnInit,
  SkipSelf,
  ViewChild,
  ViewContainerRef
}                                                                                              from '@angular/core';
import { JsfAbstractPropEditor, JsfLayoutEditor, JsfLayoutPropStringPreferences, JsfRegister } from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                      from '../../../abstract/abstract-layout-builder.component';
import { JSF_APP_CONFIG, JsfAppConfig }                                                        from '../../../../../common';
import { AbstractPropHandlerLayoutBuilderComponent }                                           from '../../../abstract/abstract-prop-handler-layout-builder.component';
import { LbPropHandlerDefaultComponent }                                                       from './lb-prop-handler-default.component';
import { ModuleLoaderService }                                                                 from '../../../../../kal-jsf-doc/services/module-loader.service';


@Component({
  selector       : 'jsf-lb-prop',
  template       : `
      <div class="jsf-lb-prop" 
           [ngClass]="getLayoutEditorClass()" 
           [matTooltip]="propPath" 
           [class.__border-color--warn]="!prop"
           [class.border]="!prop">
          <ng-container #handlerContainer></ng-container>

          <ng-container *ngIf="!hasHandler">
              <ng-container [ngSwitch]="prop?.mutableDefinition.type">
                  <!-- Boolean -->
                  <ng-container *ngSwitchCase="'boolean'">
                      <mat-checkbox [color]="themePreferences.color">
                          {{ prop.mutableDefinition.title || 'Untitled checkbox' }}
                      </mat-checkbox>
                  </ng-container>

                  <!-- String -->
                  <ng-container *ngSwitchCase="'string'">
                      <mat-form-field [color]="themePreferences.color"
                                      [appearance]="themePreferences.appearance"
                                      [class.jsf-mat-form-field-variant-standard]="isVariantStandard()"
                                      [class.jsf-mat-form-field-variant-small]="isVariantSmall()"
                                      jsfOutlineGapAutocorrect>
                          <mat-label>{{ propPath }}</mat-label>

                          <input matInput
                                 type="string"
                                 readonly>

                          <span matPrefix>{{ propType }}</span>

                          <mat-error></mat-error>
                      </mat-form-field>
                  </ng-container>
                  
                  <!-- Number -->
                  <ng-container *ngSwitchCase="'number'">
                      <mat-form-field [color]="themePreferences.color"
                                      [appearance]="themePreferences.appearance"
                                      [class.jsf-mat-form-field-variant-standard]="isVariantStandard()"
                                      [class.jsf-mat-form-field-variant-small]="isVariantSmall()"
                                      jsfOutlineGapAutocorrect>
                          <mat-label>{{ propPath }}</mat-label>

                          <input matInput
                                 type="number"
                                 readonly>

                          <span matPrefix>{{ propType }}</span>

                          <mat-error></mat-error>
                      </mat-form-field>
                  </ng-container>
                  
                  <!-- Integer -->
                  <ng-container *ngSwitchCase="'integer'">
                      <mat-form-field [color]="themePreferences.color"
                                      [appearance]="themePreferences.appearance"
                                      [class.jsf-mat-form-field-variant-standard]="isVariantStandard()"
                                      [class.jsf-mat-form-field-variant-small]="isVariantSmall()"
                                      jsfOutlineGapAutocorrect>
                          <mat-label>{{ propPath }}</mat-label>

                          <input matInput
                                 type="number"
                                 readonly>

                          <span matPrefix>{{ propType }}</span>

                          <mat-error></mat-error>
                      </mat-form-field>
                  </ng-container>
                  
                  <!-- Date -->
                  <ng-container *ngSwitchCase="'date'">
                      <mat-form-field [color]="themePreferences.color"
                                      [appearance]="themePreferences.appearance"
                                      [class.jsf-mat-form-field-variant-standard]="isVariantStandard()"
                                      [class.jsf-mat-form-field-variant-small]="isVariantSmall()"
                                      jsfOutlineGapAutocorrect>
                          <mat-label>{{ propPath }}</mat-label>

                          <input matInput
                                 type="date"
                                 [matDatepicker]="picker"
                                 readonly>
                          
                          <span matPrefix>{{ propType }}</span>
                          
                          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                          <mat-datepicker #picker [color]="themePreferences.color"></mat-datepicker>

                          <mat-error></mat-error>
                      </mat-form-field>
                  </ng-container>

                  <ng-container *ngSwitchDefault>
                      <div class="__background-color--grey-light">
                          <div class="min-h-12 d-flex flex-column justify-content-center align-items-center __color--black-30">
                              <span class="font-weight-medium d-block text-truncate">Form Control [{{ propType }}]</span>
                              <span class="d-block text-truncate">{{ propPath }}</span>
                          </div>
                      </div>
                  </ng-container>
              </ng-container>
          </ng-container>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class LbPropComponent extends AbstractLayoutBuilderComponent implements OnInit {

  @Input()
  layoutEditor: JsfLayoutEditor;

  @ViewChild('handlerContainer', { read: ViewContainerRef, static: true })
  vcRef: ViewContainerRef;

  private handlerComponentRef: ComponentRef<AbstractPropHandlerLayoutBuilderComponent>;

  get key() {
    return this.layout.key;
  }

  get prop(): JsfAbstractPropEditor<any> {
    try {
      return this.layoutEditor.jsfEditor.getProp(this.key);
    } catch {
      return null;
    }
  }

  get propType(): string {
    return this.prop ? this.prop.definition.type : 'Type?';
  }

  get propPath(): string {
    return this.prop ? this.prop.path : 'Path?';
  }

  get hasHandler() {
    return this.prop?.hasHandler;
  }

  get handlerType() {
    return this.prop?.handlerType;
  }

  get handlerCompatibilityInfo() {
    return JsfRegister.getHandlerCompatibilityOrThrow(this.handlerType);
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef,
    private loader: NgModuleFactoryLoader,
    private moduleLoaderService: ModuleLoaderService,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig
  ) {
    super(cdRef, parentCdRef);
  }

  public async ngOnInit() {
    super.ngOnInit();

    // Create handler component if it exists, otherwise use the fallback
    await this.createHandlerComponent();
  }

  get themePreferences(): JsfLayoutPropStringPreferences {
    return {
      /* Defaults */
      appearance : 'outline',
      color      : 'primary',
      variant    : 'small',
      clearable  : false,
      prefixIcon : '',
      prefixLabel: '',
      suffixIcon : '',
      suffixLabel: '',

      /* Layout overrides */
      ...(this.localThemePreferences || {})
    } as JsfLayoutPropStringPreferences;
  }

  isVariantStandard = () => this.themePreferences.variant === 'standard';
  isVariantSmall    = () => this.themePreferences.variant === 'small';

  public detectChanges() {
    this.createHandlerComponent();

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }


  private async createHandlerComponent() {
    this.vcRef.clear();

    if (this.hasHandler) {
      if (this.handlerType.includes('/')) {
        // Load handler entry component from module
        const m = (await this.moduleLoaderService.loadHandlerModule(this.handlerType)).module;

        let compFactory;

        if ((<any>m.moduleType)?.builderEntryComponent) {
          const entryComponent = (<any>m.moduleType).builderEntryComponent;
          const moduleRef      = m.create(this.injector);
          compFactory          = moduleRef.componentFactoryResolver.resolveComponentFactory<AbstractPropHandlerLayoutBuilderComponent>(entryComponent);
        } else if (!m.moduleType && (m as any).builderEntryComponent) {
          compFactory    = this.componentFactoryResolver.resolveComponentFactory((m as any).builderEntryComponent);
        }

        if (!compFactory) {
          compFactory = this.componentFactoryResolver.resolveComponentFactory(LbPropHandlerDefaultComponent);
        }

        this.handlerComponentRef = this.vcRef.createComponent(compFactory);
      } else {
        // Assume hardcoded component
        const compFactory = this.componentFactoryResolver.resolveComponentFactory(LbPropHandlerDefaultComponent);

        this.handlerComponentRef = this.vcRef.createComponent(compFactory);
      }


      // Set input values
      this.handlerComponentRef.instance.layoutEditor = this.layoutEditor;

      this.handlerComponentRef.changeDetectorRef.markForCheck();
      this.handlerComponentRef.changeDetectorRef.detectChanges();
    }
  }
}
