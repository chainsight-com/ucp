import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderDetailComponent } from './holder-detail.component';

describe('HolderDetailComponent', () => {
  let component: HolderDetailComponent;
  let fixture: ComponentFixture<HolderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
