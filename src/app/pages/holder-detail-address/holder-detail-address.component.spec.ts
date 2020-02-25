import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderDetailAddressComponent } from './holder-detail-address.component';

describe('HolderDetailAddressComponent', () => {
  let component: HolderDetailAddressComponent;
  let fixture: ComponentFixture<HolderDetailAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderDetailAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderDetailAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
