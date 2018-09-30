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
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  // not used right now
  search(phrase: string): Observable<Project[]> {
    const params = new HttpParams().set('phrase', phrase);
    this.allProjects = this.http.get<Project[]>(address + '/project/quick-search',
    {responseType: 'json', params: params});
     return this.allProjects;
  }

  getAllProjects() {
     this.allProjects = this.http.get<Project[]>(address + '/project/all', {responseType: 'json'});
    // this.allProjects = this.http.get<Project[]>('../../assets/projectExample.code-workspace', {responseType: 'json'});
    return this.allProjects;
  }

  getProjectsBasedOnQuery(query: QueryDescription): Observable<SearchResult[]> {
    const httpOptions = { headers: new HttpHeaders({ 'ContentType' : 'application/json' }) };
    return this.http.post<SearchResult[]>(address + '/search/advanced', query, httpOptions);
  }
}

