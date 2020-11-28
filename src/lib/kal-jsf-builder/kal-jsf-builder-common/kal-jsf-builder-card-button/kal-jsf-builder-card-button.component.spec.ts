import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderCardButtonComponent } from './kal-jsf-builder-card-button.component';

describe('KalJsfBuilderCardButtonComponent', () => {
  let component: KalJsfBuilderCardButtonComponent;
  let fixture: ComponentFixture<KalJsfBuilderCardButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderCardButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderCardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
