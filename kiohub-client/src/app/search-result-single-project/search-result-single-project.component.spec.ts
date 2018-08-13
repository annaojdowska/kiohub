import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultSingleProjectComponent } from './search-result-single-project.component';

describe('SearchResultSingleProjectComponent', () => {
  let component: SearchResultSingleProjectComponent;
  let fixture: ComponentFixture<SearchResultSingleProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultSingleProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultSingleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
