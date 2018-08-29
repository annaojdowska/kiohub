import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SearchService {
  private allProjects: Observable<Project[]>;
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  // not used right now
  search(phrase: string): Observable<Project[]> {
    const params = new HttpParams().set('phrase', phrase);
    this.allProjects = this.http.get<Project[]>('http://kiohub.eti.pg.gda.pl:8080/project/quick-search',
    {responseType: 'json', params: params});
     return this.allProjects;
  }

  getAllProjects() {
    this.allProjects = this.http.get<Project[]>('http://kiohub.eti.pg.gda.pl:8080/project/all', {responseType: 'json'});
    return this.allProjects;
  }
}
