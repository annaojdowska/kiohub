import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectStatus } from '../model/project-status.interface';
import { address } from './project.service';


@Injectable()
export class ProjectStatusService {

  constructor(@Inject(HttpClient) private http: HttpClient) {
}

  getStatuses(): Observable<ProjectStatus[]> {
    return this.http.get<ProjectStatus[]>(address + '/status/all', {responseType: 'json'});
 }
}
