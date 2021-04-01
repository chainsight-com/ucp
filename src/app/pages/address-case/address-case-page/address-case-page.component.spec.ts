import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCasePageComponent } from './address-case-page.component';

describe('AddressCasePageComponent', () => {
  let component: AddressCasePageComponent;
  let fixture: ComponentFixture<AddressCasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressCasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
