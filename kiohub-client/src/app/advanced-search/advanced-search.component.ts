import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { QueryDescription } from '../model/helpers/query-description.class';
import { SearchResult } from '../model/helpers/search-result.class';
import { SortingService } from '../services/sorting-service';
import { ProjectService } from '../services/project.service';
import { ValueUtils } from '../error-info/value-utils';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({height: '0px'}),
      animate('500ms linear', style({height: '*'}))
      ]),
      transition(':leave', [
      animate('500ms linear', style({height: '0px'}))
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
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp; this.assignPaginatorToDataSource(); }

  constructor(@Inject(ProjectService) private projectService: ProjectService,
      @Inject(SearchService) private searchService: SearchService,
      @Inject(SortingService) private sortingService: SortingService) {
    this.showNoResultsLabel = false;
    this.searchResults = [];
    this.sortingRules = [sortingService.alphabetical,
      sortingService.by_publication_date_descending,
      sortingService.by_publication_date_ascending];
  }

  ngOnInit() {
    this.projectService.getPublishedProjects().subscribe(results => {
      this.searchResults = results.map(r => new SearchResult(r, 0));
      this.dataSource = new MatTableDataSource<SearchResult>(this.searchResults);
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
      this.showNoResultsLabel = this.searchResults.length === 0;
      this.sortingRules = [this.sortingService.alphabetical, this.sortingService.by_publication_date_descending,
        this.sortingService.by_publication_date_ascending, this.sortingService.by_relevancy];
    });
  }

  displayPaginator(): boolean {
    if (this.searchResults === undefined) {
      return false;
    } else {
      return this.searchResults.length > 0;
    }
  }

  applySorting(sortingRule: string) {
    if (sortingRule === this.sortingService.alphabetical) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortAlphabetically(a.project.title, b.project.title));
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
}
