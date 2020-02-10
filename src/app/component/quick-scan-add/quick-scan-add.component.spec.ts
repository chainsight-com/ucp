import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickScanAddComponent } from './quick-scan-add.component';

describe('QuickScanAddComponent', () => {
  let component: QuickScanAddComponent;
  let fixture: ComponentFixture<QuickScanAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickScanAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickScanAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
