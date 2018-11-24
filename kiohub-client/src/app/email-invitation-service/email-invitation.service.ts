import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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
    return this.http.post(address + '/email/sendinvitation', params);
  }


}




