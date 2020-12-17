import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import Color                                                                    from 'color';

@Component({
  selector       : 'jsf-badge',
  templateUrl    : './jsf-badge.component.html',
  styleUrls      : ['./jsf-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfBadgeComponent implements OnInit {


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
    this.updateColor();
  }

  private updateColor() {
    this._textColor = this.color && Color(this.color).rgb().string();
    this._bgColor   = this.backgroundColor ? Color(this.backgroundColor).rgb().string() : (
      this.color && Color(this.color).alpha(.2).rgb().string()
    );

    this.cdRef.detectChanges();
  }
}
