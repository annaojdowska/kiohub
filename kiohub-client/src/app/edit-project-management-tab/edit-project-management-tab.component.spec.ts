import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectManagementTabComponent } from './edit-project-management-tab.component';

describe('EditProjectManagementTabComponent', () => {
  let component: EditProjectManagementTabComponent;
  let fixture: ComponentFixture<EditProjectManagementTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectManagementTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectManagementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
