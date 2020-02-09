import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderScanResultComponent } from './holder-scan-result.component';

describe('HolderScanResultComponent', () => {
  let component: HolderScanResultComponent;
  let fixture: ComponentFixture<HolderScanResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderScanResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderScanResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
