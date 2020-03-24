import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowLabelingComponent } from './flow-labeling.component';

describe('FlowLabelingComponent', () => {
  let component: FlowLabelingComponent;
  let fixture: ComponentFixture<FlowLabelingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowLabelingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowLabelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
