import { Injectable }    from '@angular/core';
import OverlayScrollbars from 'overlayscrollbars';

@Injectable({
  providedIn: 'root'
})
export class OverlayScrollbarsService {

  private _instances: OverlayScrollbars[] = [];
  private _pauseCounter                   = 0;

  private _resetTimeout;

  constructor() { }

  public registerOverlayScrollbarsInstance(instance: OverlayScrollbars) {
    if (instance) {
      // console.log('Registered: ', instance);
      this._instances.push(instance);
    }
  }

  public deregisterOverlayScrollbarsInstance(instance: OverlayScrollbars) {
    if (instance) {
      // console.log('Deregistered: ', instance);
      this._instances = this._instances.filter(x => x !== instance);
    }
  }

  public scrollAllTo(x: number, y: number) {
    for (const instance of this._instances) {
      instance.scroll({ x, y });
    }
  }

  setPauseCount(count: number) {
    const oldValue = this._pauseCounter;
    this._pauseCounter = count;
    // console.log('C:', this._pauseCounter);
    // this.updatePauseState(oldValue, this._pauseCounter);
  }

  private updatePauseState(oldValue: number, newValue: number) {
    /*
    if (oldValue === 0 && newValue > 0) {
      console.log('[OSS] Pausing');
      for (const instance of this._instances) {
        instance.sleep();
      }
      this._resetTimeout = setTimeout(this.forceReset.bind(this), 2000);
    } else if (oldValue > 1 && newValue === 0) {
      console.log('[OSS] Updating');
      for (const instance of this._instances) {
        instance.update();
      }
      clearTimeout(this._resetTimeout);
    }
     */
  }

  private forceReset() {
    /*
    console.log('[OSS] Resetting');
    this.setPauseCount(0);
     */
  }
}
