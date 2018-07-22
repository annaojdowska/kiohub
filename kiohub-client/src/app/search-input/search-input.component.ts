import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from '../search-service/search.service';
import { debounceTime } from 'rxjs/operators';

@Component({
selector: 'app-search-input',
templateUrl: './search-input.component.html',
styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit {
  results: any = [];
  queryField: FormControl = new FormControl();
constructor(@Inject(SearchService) private searchService: SearchService) { }

ngOnInit() {
  this.queryField.valueChanges
  .pipe(debounceTime(200))
  .subscribe(queryField => this.searchService.search(queryField)
  .subscribe((response: Response) => this.results = response.json)); // does not work right now because there's no projects in DB,
  // so I don't know how to check project's json structure. Only gets empty respone from server
 }
}
