import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsSearchFormComponent } from './my-projects-search-form.component';

describe('MyProjectsSearchFormComponent', () => {
  let component: MyProjectsSearchFormComponent;
  let fixture: ComponentFixture<MyProjectsSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProjectsSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjectsSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
