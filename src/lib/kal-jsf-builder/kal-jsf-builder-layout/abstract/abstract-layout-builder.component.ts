import { JsfLayoutEditor, omitEmptyProperties }                                                                    from '@kalmia/jsf-common-es2015';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject }                                                                                                 from 'rxjs';
import { takeUntil }                                                                                               from 'rxjs/operators';

@Component({
  template       : '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbstractLayoutBuilderComponent implements OnInit, OnDestroy {

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  /**
   * Layout editor instance.
   */
  @Input()
  layoutEditor: JsfLayoutEditor;

  /**
   * Optional additional template to display in the element's action bar.
   */
  @ViewChild('actionBarTemplate', { read: TemplateRef, static: true })
  actionBarTemplate: TemplateRef<any>;


  get layout() {
    return this.layoutEditor.mutableDefinition;
  }

  get htmlOuterClass() {
    return this.layout.htmlOuterClass || '';
  }

  get htmlClass() {
    return this.layout.htmlClass || '';
  }

  getLayoutEditorClass() {
    return this.htmlClass;
  }

  get jsfEditor() {
    return this.layoutEditor.jsfEditor;
  }

  public ngOnInit(): void {
    this.layoutEditor.updateLayout$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  constructor(protected cdRef: ChangeDetectorRef,
              protected parentCdRef: ChangeDetectorRef
  ) {}

  public detectChanges() {
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }


  public hasHtmlClass(className: string) {
    const classNames = this.htmlClass.split(' ');
    return classNames.indexOf(className) > -1;
  }

  public toggleHtmlClass(className: string) {
    let classNames = this.htmlClass.split(' ');

    if (!this.hasHtmlClass(className)) {
      classNames.push(className);
    } else {
      classNames = classNames.filter(x => x !== className);
    }

    this.layoutEditor.mutableDefinition.htmlClass = classNames.join(' ');
    this.emitDefinitionChange();
    this.cdRef.detectChanges();
  }

  public setHtmlClass(className: string) {
    if (!this.hasHtmlClass(className)) {
      const classNames = this.htmlClass.split(' ');
      classNames.push(className);
      this.layoutEditor.mutableDefinition.htmlClass = classNames.join(' ');
      this.emitDefinitionChange();
    }
  }

  public removeHtmlClass(className: string) {
    const classNames                              = this.htmlClass.split(' ');
    this.layoutEditor.mutableDefinition.htmlClass = classNames.filter(x => x !== className).join(' ');
    this.emitDefinitionChange();
  }

  get localThemePreferences() {
    return omitEmptyProperties(this.layoutEditor.mutableDefinition.preferences) as any;
  }

  /**
   * Emit a definition change event. Call this if you mutated the definition and want the changes to be reflected in other parts of the
   * application.
   */
  emitDefinitionChange() {
    this.layoutEditor.emitDefinitionChange();
  }
}
