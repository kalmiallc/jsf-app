import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Color                                                                                              from 'color';
import { colorUtils }                                                                                     from '../../../../utilities';

@Component({
  selector       : 'jsf-badge',
  templateUrl    : './jsf-badge.component.html',
  styleUrls      : ['./jsf-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfBadgeComponent implements OnInit, OnChanges {

  private _isInitialized = false;

  @Input() title: string;

  @Input() htmlClass?: string;

  @Input() color: string;
  @Input() backgroundColor?: string;

  @Input() autoColorDelimiter?: string;


  private _textColor: string;
  private _bgColor: string;

  get textColor(): string {
    if (!this.autoColorDelimiter) {
      return this._textColor;
    }
    const tokens = this.title.split(this.autoColorDelimiter);
    if (!tokens || tokens.length < 2) {
      return this._textColor;
    }
    const text = tokens[0];
    return colorUtils.getColorFromString(text);
  }

  get bgColor(): string {
    if (!this.autoColorDelimiter) {
      return this._bgColor;
    }
    const tokens = this.title.split(this.autoColorDelimiter);
    if (!tokens || tokens.length < 2) {
      return this._bgColor;
    }
    const text = tokens[0];
    return Color(colorUtils.getColorFromString(text)).alpha(.2).rgb().string();
  }


  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._isInitialized = true;

    this.updateColor();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.updateColor();
  }

  private updateColor() {
    if (!this._isInitialized) {
      return;
    }

    this.color = this.color || 'primary';

    if (this.color === 'primary' || this.color === 'accent' || this.color === 'warn') {
      this._textColor = this.color;
    } else {
      this._textColor = this.color && Color(this.color).rgb().string();
    }

    const bgColor = this.backgroundColor || this.color;
    if (bgColor === 'primary' || bgColor === 'accent' || bgColor === 'warn') {
      this._bgColor = bgColor;
    } else {
      this._bgColor = Color(bgColor).alpha(.2).rgb().string();
    }

    this.cdRef.detectChanges();
  }

}
