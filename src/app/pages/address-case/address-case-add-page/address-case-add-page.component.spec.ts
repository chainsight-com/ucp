import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCaseAddPageComponent } from './address-case-add-page.component';

describe('AddressCaseAddPageComponent', () => {
  let component: AddressCaseAddPageComponent;
  let fixture: ComponentFixture<AddressCaseAddPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressCaseAddPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCaseAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
