import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';

export interface Req {
  topic: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailInvitationService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  send(titlePl: string, collaborators: string[]) {
    const params = new HttpParams().set('titlePl', titlePl).set('collaborators', collaborators.join(', '));
    console.log(params);
    return this.http.post('http://kiohub.eti.pg.gda.pl:8080/email/sendinvitation', params);
  }


}




