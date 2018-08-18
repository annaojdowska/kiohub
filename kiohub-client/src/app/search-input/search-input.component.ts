import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from '../search-service/search.service';
import { debounceTime } from 'rxjs/operators';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';

@Component({
selector: 'app-search-input',
templateUrl: './search-input.component.html',
styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit {
  results: Project[] = [];
  queryField: FormControl = new FormControl();
  filteredOptions: Observable<Project[]>;
constructor(@Inject(SearchService) private searchService: SearchService) { }

ngOnInit() {
  this.queryField.valueChanges
  .pipe(debounceTime(50))
  .subscribe(queryField => this.searchService.search(queryField).subscribe(res => this.results = res));
 }
}
