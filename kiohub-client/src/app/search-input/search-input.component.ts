import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { debounceTime, startWith, map } from 'rxjs/operators';
import { Project } from '../model/project.interface';
import { Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ProjectDetailsService } from '../services/project-details-service';
import { Observable } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit {
  results: Project[] = [];
  filteredResults: Observable<Project[]>;
  queryField: FormControl = new FormControl();
  proxyValue: any;

  constructor(@Inject(SearchService) private searchService: SearchService, @Inject(Router) private router: Router,
    @Inject(ProjectDetailsService) private projectDetailsService: ProjectDetailsService) {

  }

  ngOnInit() {
    this.searchService.getAllProjects().subscribe(res => this.results = res);
    this.filteredResults = this.queryField.valueChanges
      .pipe(
        debounceTime(100),
        startWith(''),
        map(value => this.filter(value))
      );
  }

  filter(phrase: string): Project[] {
    if (phrase === '') {
      return [];
    }
    return this.results.filter(option => option.title.toLowerCase().includes(phrase.toLowerCase()));
  }
  goToSearchResults() {
    this.router.navigate(['/projects-base']);
  }

  mapResults(res: Project[], phrase: string) {
    this.results = res;
  }

  goToProjectView(event: MatAutocompleteSelectedEvent) {
    this.proxyValue = event.option.value.title;
    this.projectDetailsService.setSelectedProject(event.option.value);
    this.router.navigate(['/details', event.option.value.id]);
  }
}
