import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../model/project.interface';

@Injectable()
export class ProjectService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>('http://kiohub.eti.pg.gda.pl:8080/project/' + id, {responseType: 'json'});
 }
}
