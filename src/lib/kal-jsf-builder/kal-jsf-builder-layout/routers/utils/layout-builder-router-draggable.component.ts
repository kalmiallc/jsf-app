import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jsf-layout-builder-router-draggable',
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class LayoutBuilderRouterDraggableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
