import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jsf-layout-builder-router-droppable',
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class LayoutBuilderRouterDroppableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
