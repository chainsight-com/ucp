import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamespaceAddComponent } from './namespace-add.component';

describe('NamespaceAddComponent', () => {
  let component: NamespaceAddComponent;
  let fixture: ComponentFixture<NamespaceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamespaceAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespaceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
