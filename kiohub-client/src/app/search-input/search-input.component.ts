import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { debounceTime } from 'rxjs/operators';
import { Project } from '../model/project.interface';
import { Router } from '@angular/router';
import { MatOption } from '@angular/material';

@Component({
selector: 'app-search-input',
templateUrl: './search-input.component.html',
styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit {
  results: Project[] = [];
  queryField: FormControl = new FormControl();

constructor(@Inject(SearchService) private searchService: SearchService, @Inject(Router) private router: Router) { }

ngOnInit() {
  this.queryField.valueChanges
  .pipe(debounceTime(100))
  .subscribe(queryField => this.searchService.search(queryField).subscribe(res => this.mapResults(res, queryField)));
 }

 goToSearchResults() {
  this.router.navigate(['/projects-base']);
 }
 mapResults(res: Project[], phrase: string) {
  this.results = res;
  // console.log('d' + phrase + 'd');
  // console.log(this.results);
 }
}
