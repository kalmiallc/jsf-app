import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderLayoutComponent } from './kal-jsf-builder-layout.component';

describe('KalJsfBuilderLayoutComponent', () => {
  let component: KalJsfBuilderLayoutComponent;
  let fixture: ComponentFixture<KalJsfBuilderLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
