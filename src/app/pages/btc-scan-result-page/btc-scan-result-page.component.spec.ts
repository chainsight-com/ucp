import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtcScanResultPageComponent } from './btc-scan-result-page.component';

describe('BtcScanResultPageComponent', () => {
  let component: BtcScanResultPageComponent;
  let fixture: ComponentFixture<BtcScanResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtcScanResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtcScanResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
