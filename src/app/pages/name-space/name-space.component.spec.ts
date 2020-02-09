import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameSpaceComponent } from './name-space.component';

describe('NameSpaceComponent', () => {
  let component: NameSpaceComponent;
  let fixture: ComponentFixture<NameSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
