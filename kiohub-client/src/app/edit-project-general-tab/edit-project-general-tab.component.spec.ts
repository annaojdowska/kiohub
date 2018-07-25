import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectGeneralTabComponent } from './edit-project-general-tab.component';

describe('EditProjectGeneralTabComponent', () => {
  let component: EditProjectGeneralTabComponent;
  let fixture: ComponentFixture<EditProjectGeneralTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectGeneralTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectGeneralTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
