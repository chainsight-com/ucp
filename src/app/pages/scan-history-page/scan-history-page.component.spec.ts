import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanHistoryPageComponent } from './scan-history-page.component';

describe('ScanHistoryPageComponent', () => {
  let component: ScanHistoryPageComponent;
  let fixture: ComponentFixture<ScanHistoryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanHistoryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
