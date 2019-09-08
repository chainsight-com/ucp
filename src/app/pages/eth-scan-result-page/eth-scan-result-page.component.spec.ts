import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthScanResultPageComponent } from './eth-scan-result-page.component';

describe('EthScanResultPageComponent', () => {
  let component: EthScanResultPageComponent;
  let fixture: ComponentFixture<EthScanResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthScanResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthScanResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
