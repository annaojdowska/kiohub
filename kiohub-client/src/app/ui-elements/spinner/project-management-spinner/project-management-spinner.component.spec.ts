import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementSpinnerComponent } from './project-management-spinner.component';

describe('ProjectManagementSpinnerComponent', () => {
  let component: ProjectManagementSpinnerComponent;
  let fixture: ComponentFixture<ProjectManagementSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectManagementSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagementSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
