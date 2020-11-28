import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderContentComponent } from './kal-jsf-builder-content.component';

describe('KalJsfBuilderContainerComponent', () => {
  let component: KalJsfBuilderContentComponent;
  let fixture: ComponentFixture<KalJsfBuilderContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
