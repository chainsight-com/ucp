import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderScanScheduleAddComponent } from './holder-scan-schedule-add.component';

describe('HolderScanScheduleAddComponent', () => {
  let component: HolderScanScheduleAddComponent;
  let fixture: ComponentFixture<HolderScanScheduleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderScanScheduleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderScanScheduleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
