import { Component, OnInit, Inject } from '@angular/core';
import { SearchService } from '../search-service/search.service';

@Component({
selector: 'app-search-input',
templateUrl: './search-input.component.html',
styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit {

constructor(@Inject(SearchService) private searchService: SearchService) { }

ngOnInit() {
  this.searchService.getCos();
 }
}
