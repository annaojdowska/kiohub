import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';
import { address } from './project.service';
import { QueryDescription } from '../model/helpers/query-description.class';
import { SearchResult } from '../model/helpers/search-result.class';

@Injectable()
export class SearchService {
  httpOptions = { headers: new HttpHeaders({ 'ContentType' : 'application/json' }) };
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getProjectsBasedOnQuery(query: QueryDescription): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(address + '/search/advanced', query, this.httpOptions);
  }
}

