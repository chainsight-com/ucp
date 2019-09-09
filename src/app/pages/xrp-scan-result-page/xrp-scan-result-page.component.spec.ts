import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XrpScanResultPageComponent } from './xrp-scan-result-page.component';

describe('XrpScanResultPageComponent', () => {
  let component: XrpScanResultPageComponent;
  let fixture: ComponentFixture<XrpScanResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XrpScanResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XrpScanResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
