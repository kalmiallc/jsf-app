import { Injectable, OnDestroy } from '@angular/core';
import { PreloadedModule }       from '../../common';

@Injectable({
  providedIn: 'root'
})
export class ModuleCacheService implements OnDestroy {

  constructor() { }

  private cachedModules: { [key: string]: PreloadedModule } = {};


  public get(key: string): PreloadedModule {
    return this.cachedModules[key];
  }

  public has(key: string): boolean {
    return this.cachedModules[key] !== void 0;
  }

  public store(key: string, module: PreloadedModule) {
    this.cachedModules[key] = module;
  }

  public manualStore(key: string, module: {
    entryComponent: any,
    builderEntryComponent?: any,
    builder?: any,
  }) {
    this.cachedModules[key] = {
      path: key, module: module as any
    };
  }

  public ngOnDestroy(): void {
    // Delete reference to the cached modules for GC.
    this.cachedModules = void 0;
  }
}
