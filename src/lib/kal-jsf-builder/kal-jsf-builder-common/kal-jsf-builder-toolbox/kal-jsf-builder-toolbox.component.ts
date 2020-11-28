import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as OverlayScrollbars                         from 'overlayscrollbars';
import { jsfDefaultScrollOptions }                    from '../../../utilities';

@Component({
  selector       : 'jsf-kal-jsf-builder-toolbox',
  templateUrl    : './kal-jsf-builder-toolbox.component.html',
  styleUrls      : ['./kal-jsf-builder-toolbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderToolboxComponent implements OnInit {

  public readonly scrollOptions: OverlayScrollbars.Options = {
    ... jsfDefaultScrollOptions,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    resize          : 'none',
    paddingAbsolute : true
  };

  constructor() { }

  public ngOnInit(): void {

  }

}
