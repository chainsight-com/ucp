import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowLabelingAddComponent } from './flow-labeling-add.component';

describe('FlowLabelingAddComponent', () => {
  let component: FlowLabelingAddComponent;
  let fixture: ComponentFixture<FlowLabelingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowLabelingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowLabelingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
