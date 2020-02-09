import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderScanComponent } from './holder-scan.component';

describe('HolderScanComponent', () => {
  let component: HolderScanComponent;
  let fixture: ComponentFixture<HolderScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
