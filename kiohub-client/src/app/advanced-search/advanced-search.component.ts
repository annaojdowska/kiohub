import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Project } from '../model/project.interface';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatTableDataSource, MatPaginator } from '../../../node_modules/@angular/material';
import { QueryDescription } from '../model/helpers/query-description.class';

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
  showFilters: boolean;
  showNoResultsLabel: boolean;
  searchResults: Project[];
  dataSource: MatTableDataSource<Project>;
  displayedColumns: string[] = ['results'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(@Inject(SearchService) private searchService: SearchService) {
    this.showFilters = true;
    this.showNoResultsLabel = false;
  }

  ngOnInit() {
  }

  getSearchResults(query: QueryDescription) {
    this.searchService.getProjectsBasedOnQuery(query).subscribe(results => {
      this.searchResults = results;
      this.dataSource = new MatTableDataSource<Project>(this.searchResults);
      this.dataSource.paginator = this.paginator;
      this.showFilters = false;
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
