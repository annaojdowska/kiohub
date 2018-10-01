import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { QueryDescription } from '../model/helpers/query-description.class';
import { SearchResult } from '../model/helpers/search-result.class';
import { SortingService } from '../services/sorting-service';

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
export class AdvancedSearchComponent implements OnInit, AfterViewInit {
  showNoResultsLabel: boolean;
  searchResults: SearchResult[];
  dataSource: MatTableDataSource<SearchResult>;
  displayedColumns: string[] = ['results'];
  alphabetical = 'Alfabetycznie';
  by_publication_date = 'Wg daty publikacji';
  by_relevancy = 'Najtrafniejsze';
  sortingRules: string[] = [this.alphabetical, this.by_publication_date, this.by_relevancy];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(SearchService) private searchService: SearchService,
      @Inject(SortingService) private sortingService: SortingService) {
    this.showNoResultsLabel = false;
    this.searchResults = [];
  }

  ngOnInit() {
    this.searchService.getAllProjects().subscribe(results => {
      this.searchResults = results.map(r => new SearchResult(r, 0));
      this.dataSource = new MatTableDataSource<SearchResult>(this.searchResults);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getSearchResults(query: QueryDescription) {
    this.searchService.getProjectsBasedOnQuery(query).subscribe(results => {
      this.searchResults = results;
      this.dataSource = new MatTableDataSource<SearchResult>(this.searchResults);
      this.dataSource.paginator = this.paginator;
      this.showNoResultsLabel = this.searchResults.length === 0;
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
    if (sortingRule === this.alphabetical) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortAlphabetically(a.project.title, b.project.title));
    } else if (sortingRule === this.by_publication_date) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortByDate(a.project.publicationDate, b.project.publicationDate));
    } else if (sortingRule === this.by_relevancy) {
      this.searchResults = this.searchResults
        .sort((a, b) => this.sortingService.sortByScore(a.score, b.score));
    }
    this.dataSource = new MatTableDataSource<SearchResult>(this.searchResults);
    this.dataSource.paginator = this.paginator;
  }
}
