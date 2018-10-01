import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortResultsComponent } from './sort-results.component';

describe('SortResultsComponent', () => {
  let component: SortResultsComponent;
  let fixture: ComponentFixture<SortResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
