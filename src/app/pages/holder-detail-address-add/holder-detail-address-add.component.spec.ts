import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderDetailAddressAddComponent } from './holder-detail-address-add.component';

describe('HolderDetailAddressAddComponent', () => {
  let component: HolderDetailAddressAddComponent;
  let fixture: ComponentFixture<HolderDetailAddressAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderDetailAddressAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderDetailAddressAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
