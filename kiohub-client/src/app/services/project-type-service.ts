import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectType } from '../model/project-type.interface';
import { address } from './project.service';

@Injectable()
export class ProjectTypeService {

  constructor(@Inject(HttpClient) private http: HttpClient) {
}

  getTypes(): Observable<ProjectType[]> {
    return this.http.get<ProjectType[]>(address + '/type/all', {responseType: 'json'});
 }
}
