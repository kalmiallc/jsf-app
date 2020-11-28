import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector       : 'jsf-kal-jsf-builder-content',
  templateUrl    : './kal-jsf-builder-content.component.html',
  styleUrls      : ['./kal-jsf-builder-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderContentComponent implements OnInit {

  constructor() { }

  @Input() deviceSize: 'desktop' | 'tablet' | 'mobile';

  ngOnInit(): void {
  }

}
