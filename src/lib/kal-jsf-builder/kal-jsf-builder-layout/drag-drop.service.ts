import { Injectable }                                                    from '@angular/core';
import { Subject }                                                       from 'rxjs';
import { JsfEditor, JsfRegister, JsfUnknownLayout, LayoutInfoInterface } from '@kalmia/jsf-common-es2015';

export interface DragDropState {
  state: boolean;
  jsfEditor: JsfEditor;

  layoutType?: string;
  layoutDefinition?: JsfUnknownLayout;
  layoutInfo?: LayoutInfoInterface;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  private _state = false;
  get state() {
    return this._state;
  }

  public state$: Subject<DragDropState> = new Subject<DragDropState>();

  constructor() { }

  start(jsfEditor: JsfEditor, layoutType: string) {
    this._state = true;
    this.emitNewState(jsfEditor, layoutType);

    this.addEditorDragClass(jsfEditor);
  }

  stop(jsfEditor: JsfEditor) {
    this._state = false;
    this.emitNewState(jsfEditor);

    this.removeEditorDragClass(jsfEditor);
  }

  private emitNewState(jsfEditor: JsfEditor, layoutType?: string) {
    const layoutDefinition = layoutType && JsfRegister.getNewLayoutDefinition(layoutType);
    const layoutInfo       = layoutType && JsfRegister.getLayoutInfo(layoutType);

    this.state$.next({
      state: this._state,
      jsfEditor,

      layoutType,
      layoutDefinition,
      layoutInfo
    });
  }

  private addEditorDragClass(jsfEditor: JsfEditor) {
    const el = document.querySelector(`#jsf-builder-${ jsfEditor.id } .jsf-builder-layout-root`);
    el.classList.add('jsf-builder-dragging');

    document.querySelector('body').style.cursor = 'move';
  }

  private removeEditorDragClass(jsfEditor: JsfEditor) {
    const el = document.querySelector(`#jsf-builder-${ jsfEditor.id } .jsf-builder-layout-root`);
    el.classList.remove('jsf-builder-dragging');

    document.querySelector('body').style.cursor = null;
  }

}
