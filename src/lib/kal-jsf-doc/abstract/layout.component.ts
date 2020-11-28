import { JsfAbstractLayout, JsfAbstractLayoutBuilder } from '@kalmia/jsf-common-es2015';
import { OnDestroy }                                   from '@angular/core';
import { Subject }                                     from 'rxjs';

export abstract class AbstractLayoutComponent implements OnDestroy {

  protected ngUnsubscribe: Subject<void> = new Subject();

  layoutBuilder: JsfAbstractLayoutBuilder<JsfAbstractLayout>;

  get layout(): any {
    return this.layoutBuilder && this.layoutBuilder.layout;
  }

  get htmlOuterClass() {
    return this.layout.htmlOuterClass || '';
  }

  get htmlClass() {
    return this.layout.htmlClass || '';
  }

  async handleLayoutClick($event: any) {
    return this.layoutBuilder.onClick($event);
  }

  registerLayoutComponent(): void {
    if (this.layout.id) {
      this.layoutBuilder.rootBuilder.registerLayoutComponent(this.layout.id, this);
    }
  }

  unregisterLayoutComponent(): void {
    if (this.layout.id) {
      this.layoutBuilder.rootBuilder.unregisterLayoutComponent(this.layout.id);
    }
  }

  setLayoutState(key: string, value: any): any {
    if (this.layout.id) {
      this.layoutBuilder.rootBuilder.setLayoutStateUnderSameIds(
        [this.layout.id, this.layoutBuilder.id, this.layoutBuilder.idGroup],
        key,
        value
      );
    }
  }

  getLayoutState(key: string): any {
    if (this.layout.id) {
      return this.layoutBuilder.rootBuilder.getLayoutState(this.layout.id, key);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
