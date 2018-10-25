import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerUpdateProjectComponent } from './spinner-update-project.component';

describe('SpinnerUpdateProjectComponent', () => {
  let component: SpinnerUpdateProjectComponent;
  let fixture: ComponentFixture<SpinnerUpdateProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerUpdateProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerUpdateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
