import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AdvancedSearchFormComponent } from '../advanced-search-form/advanced-search-form.component';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { QueryDescription, SEARCH_DATE_FROM, SEARCH_DATE_TO, SEARCH_DESC,
  SEARCH_LICENCES, SEARCH_SEMESTERS, SEARCH_SUPERVISORS, SEARCH_TAGS, SEARCH_TITLES,
  SEARCH_TYPES } from '../model/helpers/query-description.class';
import { SearchResult } from '../model/helpers/search-result.class';
import { ProjectService } from '../services/project.service';
import { SearchService } from '../services/search.service';
import { SortingService } from '../services/sorting-service';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ height: '0px' }),
        animate('500ms linear', style({ height: '*' }))
      ]),
      transition(':leave', [
        animate('500ms linear', style({ height: '0px' }))
      ])
    ])
  ]
})
export class AdvancedSearchComponent implements OnInit {
  showNoResultsLabel: boolean;
  searchResults: SearchResult[];
  dataSource: MatTableDataSource<SearchResult>;
  displayedColumns: string[] = ['results'];
  sortingRules: string[];
  paginator: MatPaginator;
  valueUtils = new ValueUtils();
  showFilters = false;
  @ViewChild('searchForm') searchForm: AdvancedSearchFormComponent;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp; this.assignPaginatorToDataSource(); }
  @ViewChild('noResultsError') noResultsError: ErrorInfoComponent;

  constructor(@Inject(ProjectService) private projectService: ProjectService,
    @Inject(SearchService) private searchService: SearchService,
    @Inject(SortingService) private sortingService: SortingService) {
    this.showNoResultsLabel = false;
    this.searchResults = [];
    this.sortingRules = [sortingService.alphabeticallyAZ,
    sortingService.alphabeticallyZA,
    sortingService.by_publication_date_descending,
    sortingService.by_publication_date_ascending];
  }

  ngOnInit() {
    this.projectService.getPublishedProjects().subscribe(results => {
      this.searchResults = results.map(r => new SearchResult(r, 0));
      this.dataSource = new MatTableDataSource<SearchResult>(this.searchResults);
      this.showFilters = this.checkIfFiltersAreInSession();
    });
  }

  private assignPaginatorToDataSource(): void {
    if (!this.valueUtils.isNullOrUndefined(this.dataSource)) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getSearchResults(query: QueryDescription) {
    this.searchService.getProjectsBasedOnQuery(query).subscribe(results => {
      this.searchResults = results;
      this.applySorting(this.sortingService.by_relevancy);
      this.handleNoResults(this.searchResults.length === 0);
      this.sortingRules = [this.sortingService.alphabeticallyAZ, this.sortingService.alphabeticallyZA,
      this.sortingService.by_publication_date_descending,
      this.sortingService.by_publication_date_ascending,
      this.sortingService.by_relevancy];
    });
  }

  handleNoResults(value: boolean) {
    this.showNoResultsLabel = value;
    if (value) {
      this.noResultsError.setComponent(true, 'WARNING', 'Nie znaleziono projektów spełniających zadane kryteria.');
    } else {
      this.noResultsError.setComponent(true, 'SUCCESS', 'Znaleziono poniższe projekty.');
    }
  }

  displayPaginator(): boolean {
    if (this.searchResults === undefined) {
      return false;
    } else {
      return this.searchResults.length > 0;
    }
  }

  applySorting(sortingRule: string) {
    if (sortingRule === this.sortingService.alphabeticallyAZ) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortAlphabeticallyAZ(a.project.title, b.project.title));
    } else if (sortingRule === this.sortingService.alphabeticallyZA) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortAlphabeticallyZA(a.project.title, b.project.title));
    } else if (sortingRule === this.sortingService.by_publication_date_descending) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortByDateDescending(a.project.publicationDate, b.project.publicationDate));
    } else if (sortingRule === this.sortingService.by_relevancy) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortByScore(a.score, b.score));
    } else if (sortingRule === this.sortingService.by_publication_date_ascending) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortByDateAscending(a.project.publicationDate, b.project.publicationDate));
    }
    this.dataSource = new MatTableDataSource<SearchResult>(this.searchResults);
    this.assignPaginatorToDataSource();
  }

  checkIfFiltersAreInSession(): boolean {
    if (sessionStorage.length === 0 ) {
      return false;
    }
      return (sessionStorage.getItem(SEARCH_DATE_FROM) !== null && sessionStorage.getItem(SEARCH_DATE_FROM) !== 'undefined')
      || (sessionStorage.getItem(SEARCH_DATE_TO) !== null && sessionStorage.getItem(SEARCH_DATE_TO) !== 'undefined')
      || (sessionStorage.getItem(SEARCH_DESC) !== null && sessionStorage.getItem(SEARCH_DESC).length > 0)
      || (sessionStorage.getItem(SEARCH_LICENCES) !== null && sessionStorage.getItem(SEARCH_LICENCES).length > 0)
      || (sessionStorage.getItem(SEARCH_SEMESTERS) !== null && sessionStorage.getItem(SEARCH_SEMESTERS).length > 0)
      || (sessionStorage.getItem(SEARCH_SUPERVISORS) !== null && sessionStorage.getItem(SEARCH_SUPERVISORS).length > 0)
      || (sessionStorage.getItem(SEARCH_TAGS) !== null && sessionStorage.getItem(SEARCH_TAGS).length > 0)
      || (sessionStorage.getItem(SEARCH_TITLES) !== null && sessionStorage.getItem(SEARCH_TITLES).length > 0)
      || (sessionStorage.getItem(SEARCH_TYPES) !== null && sessionStorage.getItem(SEARCH_TYPES).length > 0);
  }
}
