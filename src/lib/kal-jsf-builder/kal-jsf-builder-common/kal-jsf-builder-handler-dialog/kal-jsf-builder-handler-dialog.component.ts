import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { PreloadedModule }                                                       from '../../../common';
import { uniq }                                                                  from 'lodash';
import { HandlerCompatibilityInterface, JsfRegister }                            from '@kalmia/jsf-common-es2015';
import { MAT_DIALOG_DATA, MatDialogRef }                                         from '@angular/material/dialog';
import { ModuleLoaderService }                                                   from '../../../kal-jsf-doc/services/module-loader.service';


@Component({
  selector       : 'jsf-kal-jsf-builder-handler-dialog',
  templateUrl    : './kal-jsf-builder-handler-dialog.component.html',
  styleUrls      : ['./kal-jsf-builder-handler-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderHandlerDialogComponent implements OnInit {

  public loading = true;

  constructor(public dialogRef: MatDialogRef<KalJsfBuilderHandlerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private dialogData: any,
              private cdRef: ChangeDetectorRef,
              private moduleLoaderService: ModuleLoaderService) {
  }

  private modules: PreloadedModule[];

  public handlers: string[];
  public handlersCompatibilityInfo: { [handlerType: string]: HandlerCompatibilityInterface } = {};
  public handlersByCategory: { [category: string]: string[] }                                = {};
  public handlerCategories: string[]                                                         = [];

  public selectedCategory;

  async ngOnInit() {
    const propType: 'string' = this.dialogData.propType;

    this.modules = await this.moduleLoaderService.preloadAllHandlerModules();

    this.handlers = JsfRegister.listHandlers();
    for (const handler of this.handlers) {
      const info = JsfRegister.getHandlerCompatibilityOrThrow(handler);

      if (info.compatibleWith.find(x => x.type === propType)) {
        const category = info.category || 'Other';
        if (!this.handlersByCategory[category]) {
          this.handlersByCategory[category] = [];
        }

        this.handlersCompatibilityInfo[handler] = info;
        this.handlersByCategory[category].push(handler);

        this.handlerCategories = uniq(this.handlerCategories.concat([category]));
        if (!this.selectedCategory) {
          this.selectedCategory = category;
        }
      }
    }

    this.loading = false;

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }


}
