import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCaseDetailPageComponent } from './address-case-detail-page.component';

describe('AddressCaseDetailPageComponent', () => {
  let component: AddressCaseDetailPageComponent;
  let fixture: ComponentFixture<AddressCaseDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressCaseDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCaseDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
