import {
  ComponentFactoryResolver,
  ComponentRef, ElementRef,
  Inject,
  Injectable,
  Injector,
  NgModuleFactory,
  NgModuleFactoryLoader,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { JSF_APP_CONFIG, JsfAppConfig }                                                                      from '../../common';
import { OverlayContainer }                                                                                  from '@angular/cdk/overlay';
import { JsfResponsiveService }                                                                              from './responsive.service';
import { BaseThemeComponent }                                                                                from '../theme/base-theme.component';
import { pascalcase }                                                                                        from '../../utilities';
import { JsfThemeRenderMode }                                                                                from '../theme/render-mode.enum';
import { JsfLayoutPreferencesInterface }                                                                     from '@kalmia/jsf-common-es2015';
import { isObject } from 'lodash';

export interface ThemeRendererOptions {
  disableWrapperStyles?: boolean;
  forceRenderCdkOverlay?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeRendererService {

  constructor(private loader: NgModuleFactoryLoader,
              private injector: Injector,
              private cdkOverlayContainer: OverlayContainer,
              private responsiveService: JsfResponsiveService,
              private componentFactoryResolver: ComponentFactoryResolver,
              @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig) {
  }

  private _globalThemePreferences: JsfLayoutPreferencesInterface;
  get globalThemePreferences(): JsfLayoutPreferencesInterface {
    return this._globalThemePreferences;
  }


  private get jsfThemePath(): string {
    return this.jsfAppConfig.themePath;
  }

  public async renderTheme(renderer: Renderer2,
                           container: ViewContainerRef,
                           themeOptions: string | { moduleFactory: NgModuleFactory<any> },
                           renderMode: JsfThemeRenderMode = JsfThemeRenderMode.Form,
                           options?: ThemeRendererOptions,
                           containerElementRef?: ElementRef): Promise<BaseThemeComponent> {
    container.clear();

    if (themeOptions === null) {
      this._globalThemePreferences = {
        button: {
          color  : 'primary',
          variant: 'flat'
        }
      } as any;
      return void 0;
    }

    let themeName;
    let themeVariant;
    let compFactory;

    if (isObject(themeOptions)) {
      themeName = (themeOptions.moduleFactory as any).themeName || 'default';
      themeVariant = (themeOptions.moduleFactory as any).themeVariant || 'default';
      compFactory   = this.componentFactoryResolver.resolveComponentFactory((themeOptions.moduleFactory as any).entryComponent);
    } else {
      try {
        const themePath = themeOptions;
        themeName    = themePath.split('/')[0];
        themeVariant = themePath.split('/')[1];

        const jsfThemePath = this.jsfThemePath;
        // tslint:disable-next-line
        const modulePath   = `${ jsfThemePath }themes/${ themeName }/variants/${ themeVariant }/${ themeName }-${ themeVariant }.module.ts#${ pascalcase(`${ themeName }-${ themeVariant }`) }Module`;
        const moduleFactory: NgModuleFactory<any> = await this.loader.load(modulePath);

        // Load main entry component from module
        const entryComponent = (<any>moduleFactory.moduleType).entryComponent;
        const moduleRef      = moduleFactory.create(this.injector);
        compFactory    = moduleRef.componentFactoryResolver.resolveComponentFactory(entryComponent);
      } catch (e) {
        throw new Error(e);
      }
    }

    try {
      const componentRef   = container.createComponent(compFactory);

      this.responsiveService.breakpoints = (componentRef.instance as BaseThemeComponent).breakpoints;

      (componentRef.instance as BaseThemeComponent).activeRenderMode = renderMode;

      // Add theme class to theme component & CDK overlay
      const bodyElement: HTMLElement = document.querySelector('body');

      renderer.removeClass(bodyElement, 'wrapper-styles-disabled');
      const classesToRemove   = [];
      for (const className of Array.from(bodyElement.classList)) {
        if (className.startsWith('app-theme')) {
          classesToRemove.push(className);
        }
      }
      classesToRemove.map(x => renderer.removeClass(bodyElement, x));

      const themeClassName = `app-theme-${ themeName }-${ themeVariant }`;
      renderer.addClass(bodyElement, themeClassName);

      const cdkOverlayElement = this.cdkOverlayContainer.getContainerElement();
      renderer.removeClass(cdkOverlayElement, `wrapper-styles-disabled`);
      if (options && options.disableWrapperStyles) {
        renderer.addClass(cdkOverlayElement, `wrapper-styles-disabled`);
      }

      /*
      if (renderMode === JsfThemeRenderMode.Styles) {
        if (!containerElementRef) {
          throw new Error(`No container element provided.`);
        }
        renderer.addClass(containerElementRef.nativeElement, themeClassName);
      }
     */

      if (renderMode === JsfThemeRenderMode.RouterOutlet || renderMode === JsfThemeRenderMode.Styles || this.jsfAppConfig.alwaysRenderCdkOverlay || options.forceRenderCdkOverlay) {
        // Save global theme preferences
        this._globalThemePreferences = (componentRef.instance as BaseThemeComponent).preferences;

        /*
        // Add classes to CDK overlay element
        const cdkOverlayElement = this.cdkOverlayContainer.getContainerElement();
        const classesToRemove   = [];
        for (const className of Array.from(cdkOverlayElement.classList)) {
          if (className.startsWith('app-theme')) {
            classesToRemove.push(className);
          }
        }
        classesToRemove.map(x => renderer.removeClass(cdkOverlayElement, x));
        renderer.addClass(cdkOverlayElement, themeClassName);

        if (options && options.disableWrapperStyles) {
          renderer.addClass(cdkOverlayElement, `wrapper-styles-disabled`);
        }
         */
      }

      return componentRef.instance as BaseThemeComponent;
    } catch (e) {
      throw new Error(e);
    }
  }

  public getGlobalThemeClassName(): string {
    const cdkOverlayElement = this.cdkOverlayContainer.getContainerElement();
    for (const className of Array.from(cdkOverlayElement.classList)) {
      if (className.startsWith('app-theme')) {
        return className;
      }
    }
  }

}
