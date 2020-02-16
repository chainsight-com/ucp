import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZilScanResultPageComponent } from './zil-scan-result-page.component';

describe('ZilScanResultPageComponent', () => {
  let component: ZilScanResultPageComponent;
  let fixture: ComponentFixture<ZilScanResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZilScanResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZilScanResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
