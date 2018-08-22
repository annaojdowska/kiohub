import { Component, OnInit, Inject } from '@angular/core';
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
        style({opacity: 0}),
      animate('500ms linear', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('500ms linear', style({opacity: 0}))
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
    this.searchService.getSearchResults().subscribe(result => this.searchResults = result);
  }
}
