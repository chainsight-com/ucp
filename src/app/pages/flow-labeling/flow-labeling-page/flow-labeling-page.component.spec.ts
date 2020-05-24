import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowLabelingPageComponent } from './flow-labeling-page.component';

describe('FlowLabelingComponent', () => {
  let component: FlowLabelingPageComponent;
  let fixture: ComponentFixture<FlowLabelingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowLabelingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowLabelingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
