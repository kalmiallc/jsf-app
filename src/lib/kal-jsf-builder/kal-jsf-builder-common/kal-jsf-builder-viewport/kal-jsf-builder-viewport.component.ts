import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as OverlayScrollbars                         from 'overlayscrollbars';
import { Bind }                                       from '@kalmia/jsf-common-es2015';
import { BuilderActionBarService }                    from '../../kal-jsf-builder-layout/builder-action-bar.service';
import { jsfDefaultScrollOptions }                    from '../../../utilities';

@Component({
  selector       : 'jsf-kal-jsf-builder-viewport',
  templateUrl    : './kal-jsf-builder-viewport.component.html',
  styleUrls      : ['./kal-jsf-builder-viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderViewportComponent implements OnInit {

  public readonly scrollOptions: OverlayScrollbars.Options = {
    ... jsfDefaultScrollOptions,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    resize          : 'none',
    paddingAbsolute : true,
    callbacks       : {
      onScrollStart: this.scrollStart
    }
  };

  constructor(private actionBarService: BuilderActionBarService) { }

  ngOnInit(): void {
  }

  @Bind()
  private scrollStart() {
    this.actionBarService.deselect();
  }
}
