import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloggedSearchComponent } from './unlogged-search.component';

describe('UnloggedSearchComponent', () => {
  let component: UnloggedSearchComponent;
  let fixture: ComponentFixture<UnloggedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnloggedSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnloggedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
