import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectStatus } from '../model/project-status.interface';


@Injectable()
export class ProjectStatusService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getStatuses(): Observable<ProjectStatus[]> {
    return this.http.get<ProjectStatus[]>('http://kiohub.eti.pg.gda.pl:8080/status/all', {responseType: 'json'});
 }
}
