import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SearchService {
  chosenResult: any;
  searchResults: Observable<Project[]>;
  constructor(@Inject(HttpClient) private http: HttpClient) {
    this.searchResults = new Observable<Project[]>();
   }

  search(phrase: string): Observable<Project[]> {
    const params = new HttpParams().set('phrase', phrase);
    this.searchResults = this.http.get<Project[]>('http://kiohub.eti.pg.gda.pl:8080/project/quick-search',
    {responseType: 'json', params: params});
    // this.searchResults = this.http.get<Project[]>('../../assets/projectExample.code-workspace', {responseType: 'json'});
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
