import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { TemplatePortal }                                                                from '@angular/cdk/portal';
import { JsfLayoutEditor, JsfRegister }                                                  from '@kalmia/jsf-common-es2015';

@Component({
  selector   : 'jsf-kal-jsf-builder-action-bar',
  templateUrl: './kal-jsf-builder-action-bar.component.html',
  styleUrls  : ['./kal-jsf-builder-action-bar.component.scss']
})
export class KalJsfBuilderActionBarComponent implements OnInit {

  public additionalTemplatePortal: TemplatePortal;

  @Input() layoutEditor: JsfLayoutEditor;
  @Input() additionalTemplate: TemplateRef<any>;

  @Output() close: EventEmitter<void>                   = new EventEmitter<void>();
  @Output() deleteLayout: EventEmitter<JsfLayoutEditor> = new EventEmitter<JsfLayoutEditor>();

  constructor(private vcRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.updateTemplatePortal();
  }

  getLayoutInfo(layoutType: string) {
    return JsfRegister.getLayoutInfo(layoutType || 'prop');
  }

  private updateTemplatePortal() {
    if (this.additionalTemplate) {
      this.additionalTemplatePortal = new TemplatePortal<any>(this.additionalTemplate, this.vcRef);
    }
  }

  actionBarClose() {
    this.close.emit();
  }

  actionBarDeleteLayout() {
    this.deleteLayout.emit(this.layoutEditor);
  }

}
