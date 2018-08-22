import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';
import { ProjectDetailsService } from './project-details-service';

@Injectable()
export class SearchService {
  private allProjects: Observable<Project[]>;
  constructor(@Inject(HttpClient) private http: HttpClient) {
    this.allProjects = this.http.get<Project[]>('http://kiohub.eti.pg.gda.pl:8080/project/all', {responseType: 'json'});
   }

  search(phrase: string): Observable<Project[]> {
    const params = new HttpParams().set('phrase', phrase);
    this.allProjects = this.http.get<Project[]>('http://kiohub.eti.pg.gda.pl:8080/project/quick-search',
    {responseType: 'json', params: params});
     return this.allProjects;
  }

  getAllProjects() {
    return this.allProjects;
  }
}
