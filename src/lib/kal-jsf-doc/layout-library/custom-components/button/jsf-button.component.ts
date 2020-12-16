import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector       : 'jsf-button',
  templateUrl    : './jsf-button.component.html',
  styleUrls      : ['./jsf-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsfButtonComponent implements OnInit {

  @Input() variant?: 'basic' | 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab' = 'basic';
  @Input() color?: 'primary' | 'accent' | 'none' = 'primary';
  @Input() size?: 'normal' | 'small' | 'large' = 'normal';
  @Input() disableRipple?: boolean;

  @Input() icon?: string;
  @Input() title?: string;

  @Input() htmlClass?: string;
  @Input() id?: string;
  @Input() disabled?: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  isSizeNormal = () => this.size === 'normal';
  isSizeSmall  = () => this.size === 'small';
  isSizeLarge  = () => this.size === 'large';

}
