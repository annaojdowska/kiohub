import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPostComponent } from './test-post.component';

describe('TestPostComponent', () => {
  let component: TestPostComponent;
  let fixture: ComponentFixture<TestPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
