import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { Overlay }                                            from '@angular/cdk/overlay';
import { BehaviorSubject, Observable, Subject }               from 'rxjs';
import { JsfPropBuilder, JsfPropLayoutBuilder }               from '@kalmia/jsf-common-es2015';
import { MatSelectChange }                                    from '@angular/material/select';
import { JSF_FORM_CONTROL_ERRORS }                            from '../jsf-control-errors';
import { MatChipInputEvent }                                  from '@angular/material/chips';
import { COMMA, ENTER, SPACE }                                  from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';


@Component({
  selector       : 'jsf-chip-list',
  templateUrl    : './jsf-chip-list.component.html',
  styleUrls      : ['./jsf-chip-list.component.scss'],
  providers      : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsfChipListComponent),
      multi      : true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfChipListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  readonly separatorKeysCodes: number[] = [ENTER];

  private _value: any[] = [];

  get value() {
    return this._value;
  }

  set value(x: any[]) {
    this._value = x;
    this.propagateChange(this._value);
  }

  private _control: NgControl;

  @ViewChild('input', { static: true })
  input: ElementRef<HTMLInputElement>;

  @ViewChild('autocompleteTrigger', { static: true })
  autocompleteTrigger: MatAutocompleteTrigger;

  filteredAutocompleteItems: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(void 0);

  @Input() autocompleteItems: any[] = [];

  @Input() title?: string;
  @Input() description?: string;
  @Input() id?: string;
  @Input() notitle?: boolean;
  @Input() placeholder?: string;
  @Input() required?: boolean;
  @Input() disabled?: boolean;
  @Input() name?: string;
  @Input() readonly?: boolean;

  @Input() htmlClass?: string;
  @Input() color?: 'primary' | 'accent' | 'none'                   = 'primary';
  @Input() appearance?: 'legacy' | 'standard' | 'fill' | 'outline' = 'outline';
  @Input() variant?: 'small' | 'standard'                          = 'standard';

  @Input() selectable?: boolean = false;
  @Input() removable?: boolean = true;
  @Input() addOnBlur?: boolean = true;

  @Input() errorMap?: { [errorCode: string]: string };

  // Used internally by JSF
  @Input() layoutBuilder?: JsfPropLayoutBuilder<JsfPropBuilder>;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClick: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();


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

    this.input.nativeElement.addEventListener('input', (event: InputEvent) => {
      this.filteredAutocompleteItems.next(this._filter(this.input.nativeElement.value));
    });

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.autocompleteItems.filter(option => option.toLowerCase().includes(filterValue));
  }

  autocompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.value = (this.value || []).concat([event.option.viewValue]);
    this.input.nativeElement.value = '';
    this.filteredAutocompleteItems.next(this._filter(this.input.nativeElement.value));
    // this.autocompleteTrigger.openPanel();
  }

  // Add-on-blur emulation to prevent chips being added when user clicks an autocomplete value.
  addChipOnBlur(event: FocusEvent) {
    const target: HTMLElement = event.relatedTarget as HTMLElement;
    if (!target || target.tagName !== 'MAT-OPTION') {
      const matChipEvent: MatChipInputEvent = { input: this.input.nativeElement, value : this.input.nativeElement.value };
      this.add(matChipEvent);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.value = [...(this.value || []), value];
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.cdRef.detectChanges();
  }

  remove(chip: any): void {
    this.value = this.value.filter(x => x !== chip);
    this.cdRef.detectChanges();
  }


  trackByFn(index, item) {
    return item;
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
