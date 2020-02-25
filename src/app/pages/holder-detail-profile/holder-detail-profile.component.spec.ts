import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderDetailProfileComponent } from './holder-detail-profile.component';

describe('HolderDetailProfileComponent', () => {
  let component: HolderDetailProfileComponent;
  let fixture: ComponentFixture<HolderDetailProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderDetailProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderDetailProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
