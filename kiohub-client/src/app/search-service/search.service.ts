import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SearchService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  search(query: string): Observable<Project[]> {
     return this.http.get<Project[]>('http://localhost:8080/project/all', {responseType: 'json'});
  }
}
