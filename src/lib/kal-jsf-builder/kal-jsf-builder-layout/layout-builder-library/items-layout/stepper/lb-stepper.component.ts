import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SkipSelf } from '@angular/core';
import { JsfLayoutEditor, JsfRegister }                                                   from '@kalmia/jsf-common-es2015';
import { AbstractLayoutBuilderComponent }                                                 from '../../../abstract/abstract-layout-builder.component';


@Component({
  selector       : 'jsf-lb-stepper',
  template       : `
      <div class="jsf-lb-stepper" [ngClass]="getLayoutEditorClass()">
          <div class="jsf-lb-stepper-header" [ngClass]="getLayoutEditorClass()">
              <ng-container *ngFor="let item of layoutEditor.items; let i = index">
                  <div class="jsf-lb-stepper-header-item"
                       [class.active]="selectedItem === item"
                       (click)="selectItem(item)"
                       matRipple>
                      <div class="step-icon">{{ i + 1 }}</div>
                      <span class="step-title">{{ item.definitionWithoutItems.title }}</span>
                  </div>
              </ng-container>
          </div>

          <div class="jsf-lb-stepper-step">
              <jsf-layout-builder-router
                      *ngIf="selectedItem"
                      [layoutEditor]="selectedItem">
              </jsf-layout-builder-router>
          </div>
      </div>

      <ng-template #actionBarTemplate>
          <jsf-kal-jsf-builder-action-bar-button icon="add" (click)="addStep()"></jsf-kal-jsf-builder-action-bar-button>
      </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./lb-stepper.component.scss']
})
export class LbStepperComponent extends AbstractLayoutBuilderComponent implements OnInit {

  public selectedItem: JsfLayoutEditor;

  @Input()
  layoutEditor: JsfLayoutEditor;


  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.selectedItem = this.layoutEditor.items[0];
  }

  addStep() {
    const def = JsfRegister.getNewLayoutDefinition('step') as any;
    this.layoutEditor.createItem(def);
    this.detectChanges();
  }

  selectItem(item: JsfLayoutEditor) {
    this.selectedItem = item;
    this.detectChanges();
  }
}
