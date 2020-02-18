import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickScanAddFormComponent } from './quick-scan-add-form.component';

describe('QuickScanAddFormComponent', () => {
  let component: QuickScanAddFormComponent;
  let fixture: ComponentFixture<QuickScanAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickScanAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickScanAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
