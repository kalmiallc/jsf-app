import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderExportComponent } from './kal-jsf-builder-export.component';

describe('KalJsfBuilderPreviewComponent', () => {
  let component: KalJsfBuilderExportComponent;
  let fixture: ComponentFixture<KalJsfBuilderExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
