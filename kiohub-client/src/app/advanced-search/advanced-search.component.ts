import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Project } from '../model/project.interface';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatTableDataSource, MatPaginator } from '../../../node_modules/@angular/material';

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
  searchService: SearchService;
  searchResults: Project[];
  dataSource: MatTableDataSource<Project>;
  displayedColumns: string[] = ['results'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(@Inject(SearchService) searchService: SearchService) {
    this.searchService = searchService;

  }

  ngOnInit() {
    this.searchService.getAllProjects().subscribe(result => {this.searchResults = result;
      this.dataSource = new MatTableDataSource<Project>(this.searchResults);
      this.dataSource.paginator = this.paginator; });

  }

}
