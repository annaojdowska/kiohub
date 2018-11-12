import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { address } from '../services/project.service';

export interface Req {
  topic: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailInvitationService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  send(projectId: number, collaborators: string[]) {
    const params = new HttpParams().set('projectId', projectId.toString()).set('collaborators', collaborators.join(', '));
    console.log(params);
    return this.http.post(address + '/email/sendinvitation', params);
  }


}




