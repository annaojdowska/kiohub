import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SearchService {
  chosenResult: any;
  searchResults: Observable<Project[]>;
  constructor(@Inject(HttpClient) private http: HttpClient) {
    this.searchResults = this.http.get<Project[]>('../../assets/projectExample.code-workspace', {responseType: 'json'});
   }

  search(query: string): Observable<Project[]> {
    // this.searchResults = this.http.get<Project[]>('http://localhost:8080/project/all', {responseType: 'json'});
    this.searchResults = this.http.get<Project[]>('../../assets/projectExample.code-workspace', {responseType: 'json'});
     return this.searchResults;
  }

  getChosenSearchResult() {
    return this.chosenResult;
  }

  setChosenSearchResult() {} // todo: after click on chosen search results

  getSearchResults() {
    return this.searchResults;
  }
}
