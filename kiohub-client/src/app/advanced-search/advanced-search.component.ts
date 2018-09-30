import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Project } from '../model/project.interface';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { QueryDescription } from '../model/helpers/query-description.class';
import { SearchResult } from '../model/helpers/search-result.class';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(@Inject(SearchService) private searchService: SearchService) {
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
}
