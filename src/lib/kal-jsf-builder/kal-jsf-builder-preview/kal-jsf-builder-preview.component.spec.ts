import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderPreviewComponent } from './kal-jsf-builder-preview.component';

describe('KalJsfBuilderPreviewComponent', () => {
  let component: KalJsfBuilderPreviewComponent;
  let fixture: ComponentFixture<KalJsfBuilderPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
