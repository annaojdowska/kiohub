import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectType } from '../model/project-type.interface';

@Injectable()
export class ProjectTypeService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getTypes(): Observable<ProjectType[]> {
    return this.http.get<ProjectType[]>('http://kiohub.eti.pg.gda.pl:8080/type/all', {responseType: 'json'});
 }
}
