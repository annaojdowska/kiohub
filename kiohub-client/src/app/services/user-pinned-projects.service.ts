import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '../../../node_modules/@angular/common/http';
import { address } from './project.service';
import { Project } from '../model/project.interface';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPinnedProjectsService {

  httpOptions = {
    headers: new HttpHeaders({
      'ContentType': 'application/json'
    })
  };

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  pin(userId: number, projectId: number) {
    const params = new HttpParams()
    .set('projectId', projectId.toString())
    .set('userId', userId.toString());
    return this.http.post(address + '/userpinnedproject/pin', params, this.httpOptions);
  }

  unPin(userId: number, projectId: number) {
    const params = new HttpParams()
    .set('projectId', projectId.toString())
    .set('userId', userId.toString());
    return this.http.post(address + '/userpinnedproject/unpin', params, this.httpOptions);
  }

  isPinned(userId: number, projectId: number): Observable<boolean> {
    const params = new HttpParams()
    .set('projectId', projectId.toString())
    .set('userId', userId.toString());
    return this.http.post<boolean>(address + '/userpinnedproject/ispinned', params, this.httpOptions);
  }

  allPinned(userId: number): Observable<number[]> {
    return this.http.get<number[]>(address + '/userpinnedproject/user/' + userId, { responseType: 'json' });
  }
}
