import { Component, OnInit, Inject } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { Project } from '../model/project.interface';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
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
