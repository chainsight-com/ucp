import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickScanResultComponent } from './quick-scan-result.component';

describe('QuickScanResultComponent', () => {
  let component: QuickScanResultComponent;
  let fixture: ComponentFixture<QuickScanResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickScanResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickScanResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
