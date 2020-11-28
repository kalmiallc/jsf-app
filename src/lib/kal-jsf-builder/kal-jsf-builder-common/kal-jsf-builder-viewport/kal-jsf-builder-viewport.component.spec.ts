import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderViewportComponent } from './kal-jsf-builder-viewport.component';

describe('KalJsfBuilderViewportComponent', () => {
  let component: KalJsfBuilderViewportComponent;
  let fixture: ComponentFixture<KalJsfBuilderViewportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderViewportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
