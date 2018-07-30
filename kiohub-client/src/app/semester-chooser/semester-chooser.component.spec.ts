import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterChooserComponent } from './semester-chooser.component';

describe('SemesterChooserComponent', () => {
  let component: SemesterChooserComponent;
  let fixture: ComponentFixture<SemesterChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemesterChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
