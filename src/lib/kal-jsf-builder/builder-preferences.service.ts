import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuilderPreferencesService {

  private _preferences = {};

  public update$: Subject<void> = new Subject<void>();

  constructor() {
    this.loadFromLocalStorage();
  }

  public get(key: string, defaultValue?: string | number | boolean | object) {
    if (!this._preferences[key] && defaultValue) {
      this.set(key, defaultValue);
    }
    return this._preferences[key];
  }

  public set(key: string, value: string | number | boolean | object) {
    this._preferences[key] = value;
    this.saveToLocalStorage();
    this.update$.next();
  }

  public loadFromLocalStorage() {
    this._preferences = JSON.parse(localStorage.getItem('jsf-builder-preferences') || '{}');
  }

  public saveToLocalStorage() {
    localStorage.setItem('jsf-builder-preferences', JSON.stringify(this._preferences));
  }

}
