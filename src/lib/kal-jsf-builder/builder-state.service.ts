import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuilderStateService {

  private _state = {};

  constructor() {
  }

  public get(key: string, defaultValue?: any) {
    return this._state[key];
  }

  public set(key: string, value: any) {
   this._state[key] = value;
  }

  public clear() {
    this._state = {};
  }

}
