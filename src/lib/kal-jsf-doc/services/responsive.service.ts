import { Observable }                          from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HostListener, Injectable, OnInit }    from '@angular/core';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BreakpointOrCustomSize = Breakpoint | string;

export interface JsfBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export const jsfDefaultBreakpoints: JsfBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
};

@Injectable({
  providedIn: 'root'
})
export class JsfResponsiveService {

  /**
   * Breakpoint sizes.
   */
  private _breakpoints: JsfBreakpoints = jsfDefaultBreakpoints;

  public get breakpoints() {
    return this._breakpoints;
  }

  public set breakpoints(breakpoints: JsfBreakpoints) {
    // tslint:disable-next-line:no-console
    this._breakpoints = breakpoints;
    this.updateGlobalBreakpointClasses();
  }

  constructor(private breakpointObserver: BreakpointObserver) {
    this.updateGlobalBreakpointClasses();
    window.addEventListener('resize', () => this.updateGlobalBreakpointClasses());

  }

  /**
   * Returns true if given breakpoint is currently active.
   * @param breakpoint breakpoint name or custom size with units.
   */
  public isBreakpointMatched(breakpoint: BreakpointOrCustomSize): boolean {
    let matchSize;
    if (this.breakpoints[breakpoint] !== undefined) {
      matchSize = `${ this.breakpoints[breakpoint] }px`;
    } else {
      matchSize = `${ breakpoint }`;
    }

    return this.breakpointObserver.isMatched(`(min-width: ${ matchSize })`);
  }

  /**
   * Match a breakpoint or custom screen size (up).
   * @param breakpoint breakpoint name or custom size with units.
   */
  public matchMediaBreakpointUp(breakpoint: BreakpointOrCustomSize): Observable<BreakpointState> {
    let matchSize;
    if (this.breakpoints[breakpoint] !== undefined) {
      matchSize = `${ this.breakpoints[breakpoint] }px`;
    } else {
      matchSize = `${ breakpoint }`;
    }

    // TODO what happens when breakpoints change? We need to emit state based on new values. It's fine for now because all values are set
    // before anything is rendered...
    return this.breakpointObserver
      .observe([`(min-width: ${ matchSize })`]);
  }

  public updateGlobalBreakpointClasses() {
    const bodyElement = document.querySelector('body');
    bodyElement.classList.remove('jsf-breakpoint-xs');
    bodyElement.classList.remove('jsf-breakpoint-sm');
    bodyElement.classList.remove('jsf-breakpoint-md');
    bodyElement.classList.remove('jsf-breakpoint-lg');
    bodyElement.classList.remove('jsf-breakpoint-xl');

    if (this.isBreakpointMatched('xs')) {
      bodyElement.classList.add('jsf-breakpoint-xs');
    }
    if (this.isBreakpointMatched('sm')) {
      bodyElement.classList.add('jsf-breakpoint-sm');
    }
    if (this.isBreakpointMatched('md')) {
      bodyElement.classList.add('jsf-breakpoint-md');
    }
    if (this.isBreakpointMatched('lg')) {
      bodyElement.classList.add('jsf-breakpoint-lg');
    }
    if (this.isBreakpointMatched('xl')) {
      bodyElement.classList.add('jsf-breakpoint-xl');
    }
  }
}
