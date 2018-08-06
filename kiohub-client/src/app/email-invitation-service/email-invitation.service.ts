import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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

  send(topic: string, recipients: string[]): Observable<string> {
    console.log('http://localhost:8080/sendinvitation?topic=' + topic + '&recipient=' + recipients[0]);
     return this.http.get<string>(
       'http://localhost:8080/sendinvitation?topic=' + topic + '&recipient=' + recipients[0],
       {responseType: 'json'}
      );
  }


}




