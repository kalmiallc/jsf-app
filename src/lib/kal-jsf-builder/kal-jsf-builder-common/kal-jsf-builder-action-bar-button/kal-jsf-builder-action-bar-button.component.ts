import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jsf-kal-jsf-builder-action-bar-button',
  templateUrl: './kal-jsf-builder-action-bar-button.component.html',
  styleUrls: ['./kal-jsf-builder-action-bar-button.component.scss']
})
export class KalJsfBuilderActionBarButtonComponent implements OnInit {

  @Input() icon: string;
  @Input() label?: string;

  @Input() active?: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
