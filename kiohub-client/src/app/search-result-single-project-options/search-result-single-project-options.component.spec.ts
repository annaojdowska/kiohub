import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultSingleProjectOptionsComponent } from './search-result-single-project-options.component';

describe('SearchResultSingleProjectOptionsComponent', () => {
  let component: SearchResultSingleProjectOptionsComponent;
  let fixture: ComponentFixture<SearchResultSingleProjectOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultSingleProjectOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultSingleProjectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
