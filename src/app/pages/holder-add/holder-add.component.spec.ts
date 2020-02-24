import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderAddComponent } from './holder-add.component';

describe('HolderAddComponent', () => {
  let component: HolderAddComponent;
  let fixture: ComponentFixture<HolderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
