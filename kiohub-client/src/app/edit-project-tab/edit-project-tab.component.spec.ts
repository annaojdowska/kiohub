import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectTabComponent } from './edit-project-tab.component';

describe('EditProjectTabComponent', () => {
  let component: EditProjectTabComponent;
  let fixture: ComponentFixture<EditProjectTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
