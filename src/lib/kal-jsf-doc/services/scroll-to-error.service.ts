import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsfScrollToErrorService {

  constructor() { }

  /**
   * Magically scrolls view to the first error found on the page.
   */
  public scrollViewToError() {
    setTimeout(() => {
      const errorElements = Array.from(document.querySelectorAll('.jsf-error'));

      const visibleErrorElements = errorElements.filter(x => {
        const s = getComputedStyle(x);
        return (s.display !== 'none');
      });

      if (!visibleErrorElements.length) {
        return;
      }

      visibleErrorElements[0].scrollIntoView(false);
    }, 0);
  }

}
