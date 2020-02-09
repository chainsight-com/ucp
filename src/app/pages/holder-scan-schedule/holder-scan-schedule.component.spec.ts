import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderScanScheduleComponent } from './holder-scan-schedule.component';

describe('HolderScanScheduleComponent', () => {
  let component: HolderScanScheduleComponent;
  let fixture: ComponentFixture<HolderScanScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderScanScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderScanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
