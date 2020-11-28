import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalJsfBuilderHandlerDialogComponent } from './kal-jsf-builder-handler-dialog.component';

describe('KalJsfBuilderHandlerDialogComponent', () => {
  let component: KalJsfBuilderHandlerDialogComponent;
  let fixture: ComponentFixture<KalJsfBuilderHandlerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalJsfBuilderHandlerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalJsfBuilderHandlerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
