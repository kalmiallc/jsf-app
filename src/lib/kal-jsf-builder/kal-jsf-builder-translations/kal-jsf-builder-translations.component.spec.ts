import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderTranslationsComponent } from './kal-jsf-builder-translations.component';

describe('KalJsfBuilderPreviewComponent', () => {
  let component: KalJsfBuilderTranslationsComponent;
  let fixture: ComponentFixture<KalJsfBuilderTranslationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderTranslationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
