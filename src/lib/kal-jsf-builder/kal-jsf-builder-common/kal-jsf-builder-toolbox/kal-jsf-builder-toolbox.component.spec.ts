import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderToolboxComponent } from './kal-jsf-builder-toolbox.component';

describe('KalJsfBuilderToolboxComponent', () => {
  let component: KalJsfBuilderToolboxComponent;
  let fixture: ComponentFixture<KalJsfBuilderToolboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderToolboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
