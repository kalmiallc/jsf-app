import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderConfigComponent } from './kal-jsf-builder-config.component';

describe('KalJsfBuilderConfigComponent', () => {
  let component: KalJsfBuilderConfigComponent;
  let fixture: ComponentFixture<KalJsfBuilderConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
