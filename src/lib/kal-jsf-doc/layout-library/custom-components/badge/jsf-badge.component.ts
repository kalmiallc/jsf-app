import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import Color                                                                    from 'color';

@Component({
  selector       : 'jsf-badge',
  templateUrl    : './jsf-badge.component.html',
  styleUrls      : ['./jsf-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfBadgeComponent implements OnInit {

  private _isInitialized = false;

  @Input() title: string;

  @Input() htmlClass?: string;

  private _color: string;
  @Input()
  public get color(): string {
    return this._color;
  }
  public set color(value: string) {
    this._color = value;
    this.updateColor();
  }

  @Input() backgroundColor?: string;


  private _textColor: string;
  private _bgColor: string;

  get textColor(): string {
    return this._textColor;
  }

  get bgColor(): string {
    return this._bgColor;
  }


  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._isInitialized = true;

    this.updateColor();
  }

  private updateColor() {
    if (!this._isInitialized) {
      return;
    }

    if (this.color === 'primary' || this.color === 'accent' || this.color === 'warn') {
      this._textColor = this.color;
    } else {
      this._textColor = this.color && Color(this.color).rgb().string();
    }

    const bgColor = this.backgroundColor || this.color;
    if (bgColor === 'primary' || bgColor === 'accent' || bgColor === 'warn') {
      this._bgColor = bgColor;
    } else {
      this._bgColor   =  Color(bgColor).alpha(.2).rgb().string();
    }

    this.cdRef.detectChanges();
  }
}
