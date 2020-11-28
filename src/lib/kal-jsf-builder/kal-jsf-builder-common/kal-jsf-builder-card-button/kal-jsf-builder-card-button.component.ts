import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector       : 'jsf-kal-jsf-builder-card-button',
  templateUrl    : './kal-jsf-builder-card-button.component.html',
  styleUrls      : ['./kal-jsf-builder-card-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderCardButtonComponent implements OnInit {

  @Input() label: string;
  @Input() iconPath?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
