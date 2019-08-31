import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScanPageComponent } from './new-scan-page.component';

describe('NewScanPageComponent', () => {
  let component: NewScanPageComponent;
  let fixture: ComponentFixture<NewScanPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewScanPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewScanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
