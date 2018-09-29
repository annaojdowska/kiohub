import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectNotesTabComponent } from './edit-project-notes-tab.component';

describe('EditProjectNotesTabComponent', () => {
  let component: EditProjectNotesTabComponent;
  let fixture: ComponentFixture<EditProjectNotesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectNotesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectNotesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
