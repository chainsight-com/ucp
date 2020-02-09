import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickScanComponent } from './quick-scan.component';

describe('QuickScanComponent', () => {
  let component: QuickScanComponent;
  let fixture: ComponentFixture<QuickScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
