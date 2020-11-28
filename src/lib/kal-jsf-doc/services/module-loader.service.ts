import { Inject, Injectable, NgModuleFactoryLoader }                   from '@angular/core';
import { ModuleCacheService }                                          from './module-cache.service';
import { JSF_APP_CONFIG, JSF_HANDLERS, JsfAppConfig, PreloadedModule } from '../../common';
import { pascalcase }                                                  from '../../utilities';
import { uniq }                                                        from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ModuleLoaderService {

  constructor(private moduleCacheService: ModuleCacheService,
              @Inject(JSF_APP_CONFIG) private jsfAppConfig: JsfAppConfig,
              @Inject(JSF_HANDLERS) private jsfHandlers: string[],
              private loader: NgModuleFactoryLoader) { }


  public async preloadAllHandlerModules(): Promise<PreloadedModule[]> {
    let handlerPaths                          = this.jsfHandlers;
    const modules: Promise<PreloadedModule>[] = [];

    handlerPaths = uniq(handlerPaths);
    for (const path of handlerPaths) {
      if (this.moduleCacheService.has(path)) {
        modules.push(Promise.resolve(this.moduleCacheService.get(path)));
      } else {
        modules.push(this.loadHandlerModule(path));
      }
    }

    return Promise.all(modules);
  }

  public async loadHandlerModule(handlerPath: string): Promise<PreloadedModule> {
    if (this.moduleCacheService.has(handlerPath)) {
      return this.moduleCacheService.get(handlerPath);
    }

    const pathTokens = handlerPath.split('/');
    if (pathTokens.length !== 2) {
      throw new Error(`Invalid handler module name format: ${ handlerPath }`);
    }

    const handlerCategory = pathTokens[0];
    const handlerName     = pathTokens[1];
    // tslint:disable-next-line
    const modulePath      = `${ this.jsfAppConfig.handlersPath }${ handlerCategory }/handlers/${ handlerName }/app/${ handlerName }.module.ts#${ pascalcase(handlerName) }Module`;

    return new Promise<PreloadedModule>((resolve, reject) => {
      this.loader.load(modulePath)
        .then(module => {
          // Save module to module cache
          const preloadedModule: PreloadedModule = {
            path: handlerPath,
            module
          };

          this.moduleCacheService.store(handlerPath, preloadedModule);

          // Resolve the module
          resolve({
            path: handlerPath,
            module
          });
        })
        .catch(err => reject(err));
    });
  }

}
