import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Project } from '../model/project.interface';
import { trigger, style, animate, transition } from '@angular/animations';

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
  constructor(@Inject(SearchService) searchService: SearchService) {
    this.searchService = searchService;
  }

  ngOnInit() {
    this.searchService.getAllProjects().subscribe(result => this.searchResults = result);
  }

}
