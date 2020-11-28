import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderCardButtonContainerComponent } from './kal-jsf-builder-card-button-container.component';

describe('KalJsfBuilderCardButtonContainerComponent', () => {
  let component: KalJsfBuilderCardButtonContainerComponent;
  let fixture: ComponentFixture<KalJsfBuilderCardButtonContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderCardButtonContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderCardButtonContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
