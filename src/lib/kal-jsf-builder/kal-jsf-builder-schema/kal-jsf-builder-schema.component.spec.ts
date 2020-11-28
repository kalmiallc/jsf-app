import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderSchemaComponent } from './kal-jsf-builder-schema.component';

describe('KalJsfBuilderSchemaComponent', () => {
  let component: KalJsfBuilderSchemaComponent;
  let fixture: ComponentFixture<KalJsfBuilderSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
