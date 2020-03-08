import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderGroupComponent } from './holder-group.component';

describe('HolderGroupComponent', () => {
  let component: HolderGroupComponent;
  let fixture: ComponentFixture<HolderGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
