import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilitySelectComponent } from './visibility-select.component';

describe('VisibilitySelectComponent', () => {
  let component: VisibilitySelectComponent;
  let fixture: ComponentFixture<VisibilitySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilitySelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilitySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
