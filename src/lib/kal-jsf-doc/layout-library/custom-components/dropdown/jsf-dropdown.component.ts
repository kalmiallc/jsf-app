import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output, TemplateRef,
  ViewChild
}                                                             from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { Overlay }                                            from '@angular/cdk/overlay';
import { Subject }                                            from 'rxjs';
import { JsfPropBuilder, JsfPropLayoutBuilder }               from '@kalmia/jsf-common-es2015';
import { ErrorStateMatcher }                                  from '@angular/material/core';
import { MatSelect, MatSelectChange }                         from '@angular/material/select';
import * as OverlayScrollbars                                 from 'overlayscrollbars';
import { jsfDefaultScrollOptions }                            from '../../../../utilities';
import { JSF_FORM_CONTROL_ERRORS }                            from '../jsf-control-errors';
import { takeUntil }                                          from 'rxjs/operators';
import { MatOption, MatOptionSelectionChange }                from '@kalmia/material/core';
import { VirtualScrollerComponent }                           from 'ngx-virtual-scroller';


export interface JsfDropdownItem {
  value: any;
  label: string;
}

@Component({
  selector       : 'jsf-dropdown',
  templateUrl    : './jsf-dropdown.component.html',
  styleUrls      : ['./jsf-dropdown.component.scss'],
  providers      : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsfDropdownComponent),
      multi      : true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfDropdownComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private _value: any | any[];

  get value() {
    return this._value;
  }

  set value(x: any | any[]) {
    this._value = x;
    this.propagateChange(this._value);
  }

  private _search                         = void 0;
  private searchChange: EventEmitter<any> = new EventEmitter<any>();

  public get search(): any {
    return this._search;
  }

  public set search(x: any) {
    this._search = x;
    this.searchChange.emit(x);
  }

  private _filteredItems: JsfDropdownItem[] = [];


  private _control: NgControl;


  private _items: JsfDropdownItem[] = [];
  @Input()
  public get items(): JsfDropdownItem[] {
    return this._items;
  }

  public set items(value: JsfDropdownItem[]) {
    this._items = value;
    this.updateFilteredItems();
  }

  dropdownPanelOpen = false;

  @ViewChild('dropdown', { read: MatSelect, static: false })
  matSelect: MatSelect;

  @ViewChild('scroll', { read: VirtualScrollerComponent })
  virtualScroll: VirtualScrollerComponent;


  @Input() multiple?: boolean;
  @Input() searchable?: boolean;

  @Input() title?: string;
  @Input() description?: string;
  @Input() id?: string;
  @Input() notitle?: boolean;
  @Input() placeholder?: string;
  @Input() required?: boolean;
  @Input() disabled?: boolean;
  @Input() name?: string;
  @Input() readonly?: boolean;
  @Input() stepperButtons?: boolean;

  @Input() iconNext     = 'keyboard_arrow_right';
  @Input() iconPrevious = 'keyboard_arrow_left';

  @Input() htmlClass?: string;
  @Input() color?: 'primary' | 'accent' | 'none'                   = 'primary';
  @Input() appearance?: 'legacy' | 'standard' | 'fill' | 'outline' = 'outline';
  @Input() variant?: 'small' | 'standard'                          = 'standard';

  @Input() panelFooterTemplate: TemplateRef<any>;

  @Input() prefixIcon?: string;
  @Input() prefixLabel?: string;
  @Input() suffixIcon?: string;
  @Input() suffixLabel?: string;
  @Input() clearable?: boolean;
  @Input() optionItemHeightPx = 32; // Should match the height of each item in CSS. Needed for virtual scrolling.

  @Input() nullValueLabel?: string            = $localize`--`;
  @Input() searchPlaceholderLabel?: string    = $localize`Search`;
  @Input() searchNoEntriesFoundLabel?: string = $localize`No results.`;

  @Input() errorMap?: { [errorCode: string]: string };

  // Used internally by JSF
  @Input() layoutBuilder?: JsfPropLayoutBuilder<JsfPropBuilder>;
  @Input() errorStateMatcher?: ErrorStateMatcher;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClick: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();


  public readonly scrollOptions: OverlayScrollbars.Options = {
    ...jsfDefaultScrollOptions,
    autoUpdateInterval: 100,
    overflowBehavior  : {
      x: 'hidden',
      y: 'scroll'
    },
    resize            : 'none',
    paddingAbsolute   : true
  };

  get hasNoItems() {
    return (!this.items || this.items.length === 0);
  }

  get hasNullValueOption() {
    return !this.required && !this.isArray && !this.multiple;
  }

  get dropdownContentHeight() {
    // In order to try and combat the dropdown appearing off-screen issue we set the initial items count to 100 if there are no filtered items available.
    // This should hopefully force the thing on screen.
    return ((this.filteredItems ? this.filteredItems.length : 100) + (this.hasNullValueOption ? 1 : 0)) * this.optionItemHeightPx;
  }

  get useVirtualScroll() {
    return this.items.length >= 50;
  }

  get errors() {
    let errors = [];
    if (this.layoutBuilder) {
      errors = this.layoutBuilder.propBuilder.errors.map(x => x.interpolatedMessage);
    } else if (this._control) {
      for (const k of Object.keys(this._control.errors || {})) {
        if (!this._control.errors[k]) {
          continue;
        }

        let m: any;
        if (this.errorMap && this.errorMap[k]) {
          m = this.errorMap[k];
        } else if (this.defaultErrorMap[k]) {
          m = this.defaultErrorMap[k];
        } else {
          m = $localize`Field is invalid`;
        }

        errors.push(m(this._control.errors[k]));
      }
    }
    return errors;
  }

  private propagateChange = (_: any) => {};

  constructor(private cdRef: ChangeDetectorRef,
              private injector: Injector,
              @Inject(JSF_FORM_CONTROL_ERRORS) private defaultErrorMap,
              protected overlay: Overlay) { }

  ngOnInit(): void {
    this._control = this.injector.get(NgControl);

    this.updateFilteredItems();

    this.searchChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateFilteredItems();
        this.cdRef.detectChanges();
      });

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  get filteredItems(): JsfDropdownItem[] {
    return this._filteredItems;
  }

  get isArray(): boolean {
    return this.multiple;
  }

  previousItem() {
    const idx  = this.selectedItemIndex;
    this.value = (idx !== undefined && idx > -1) ? this._items[Math.max(0, idx - 1)].value : this._items[0].value;
  }

  nextItem() {
    const idx  = this.selectedItemIndex;
    this.value = (idx !== undefined && idx > -1)
      ? this._items[Math.min(this._items.length - 1, idx + 1)].value
      : this._items[this._items.length - 1].value;
  }

  private updateFilteredItems() {
    this._filteredItems = this.search
      ? this._items.filter(x => x.label.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0)
      : [].concat(this._items);

    if (this.multiple) {
      this._filteredItems.sort((a: JsfDropdownItem, b: JsfDropdownItem) => {
        if (this.isItemSelected(a) && !this.isItemSelected(b)) {
          return -1;
        }
        if (!this.isItemSelected(a) && this.isItemSelected(b)) {
          return 1;
        }
        return this.items.indexOf(a) - this.items.indexOf(b);
      });
    }

    if (this.virtualScroll) {
      this.virtualScroll.refresh();
    }

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  get selectedItem(): JsfDropdownItem {
    if (this.value) {
      return this._items.find(x => x.value === this.value);
    }
  }

  get selectedItemIndex(): number {
    if (this.value) {
      return this._items.findIndex(x => x.value === this.value);
    }
  }

  selectItem(item: JsfDropdownItem) {
    if (this.multiple) {
      this.value = (this.value || []).concat([item.value]);
    } else {
      this.value = item.value;
    }
  }

  deselectItem(item: JsfDropdownItem) {
    if (this.multiple) {
      this.value = this.value.filter(x => x !== item.value);
    }
  }

  itemSelectionChange(selectionEvent: MatOptionSelectionChange, item: JsfDropdownItem) {
    if (!selectionEvent.isUserInput) {
      return;
    }
    if (selectionEvent.source.selected) {
      this.selectItem(item);
    } else {
      this.deselectItem(item);
    }
  }

  isItemSelected(item: JsfDropdownItem) {
    if (!this.multiple) {
      return this.selectedItem?.value === item.value;
    }

    if ((this.value as any[] || []).find(x => x === item.value)) {
      return true;
    }
  }

  trackByFn(index, item) {
    return item.value;
  }

  openedChange(state: boolean) {
    if (state) {
      this.dropdownPanelOpen = true;
      this.cdRef.detectChanges();

      setTimeout(() => {
        (this.matSelect.panel.nativeElement as HTMLElement).classList.add('jsf-dropdown-panel-visible');
        this.fixPanelPosition();

        if (this.virtualScroll) {
          this.virtualScroll.refresh();
        }
      }, 0);
    } else {
      this.dropdownPanelOpen = false;
      this.updateFilteredItems();
      this.cdRef.detectChanges();
    }
  }

  private fixPanelPosition() {
    (this.matSelect.overlayDir.overlayRef as any)._positionStrategy._positionLocked = false;
    (this.matSelect.overlayDir.overlayRef as any)._positionStrategy.apply();
    (this.matSelect.overlayDir.overlayRef as any)._positionStrategy._positionLocked = true;
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: any): void {
  }

  public writeValue(obj: any): void {
    this._value = obj;
    this.cdRef.detectChanges();
  }


  isVariantStandard = () => this.variant === 'standard';
  isVariantSmall    = () => this.variant === 'small';
}
