import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderGroupAddComponent } from './holder-group-add.component';

describe('HolderGroupAddComponent', () => {
  let component: HolderGroupAddComponent;
  let fixture: ComponentFixture<HolderGroupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderGroupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
