import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';
import { address } from './project.service';
import { QueryDescription } from '../model/helpers/query-description.class';
import { SearchResult } from '../model/helpers/search-result.class';

@Injectable()
export class SearchService {
  private allProjects: Observable<Project[]>;
  httpOptions = { headers: new HttpHeaders({ 'ContentType' : 'application/json' }) };
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  // not used right now
  // search(phrase: string): Observable<Project[]> {
  //   const params = new HttpParams().set('phrase', phrase);
  //   this.allProjects = this.http.get<Project[]>(address + '/project/quick-search',
  //   {responseType: 'json', params: params});
  //    return this.allProjects;
  // }

  getProjectsBasedOnQuery(query: QueryDescription): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(address + '/search/advanced', query, this.httpOptions);
  }

  getProjectsBasedOnStatus(statusId: number, collaboratorId: number): Observable<Project[]> {
    return this.http.get<Project[]>(address + '/search/by-status/' + statusId + '/by-collaborator/ ' + collaboratorId, {responseType: 'json'});
  }
}

