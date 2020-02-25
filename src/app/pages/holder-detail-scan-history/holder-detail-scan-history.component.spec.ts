import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderDetailScanHistoryComponent } from './holder-detail-scan-history.component';

describe('HolderDetailScanHistoryComponent', () => {
  let component: HolderDetailScanHistoryComponent;
  let fixture: ComponentFixture<HolderDetailScanHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderDetailScanHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderDetailScanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
