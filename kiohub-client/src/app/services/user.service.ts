import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user.interface';
import { address } from './project.service';
import { UserEmail } from '../model/user-email.interface';

@Injectable()
export class UserService {

private currentUser: boolean; // only temporarily, later will have interface User

constructor(@Inject(HttpClient) private http: HttpClient) { }

    getCurrentUser(): boolean {
        // return this.currentUser
        // ? this.currentUser
        // : this.http.get('api/login/currentUser', {responseType: 'json'}).subscribe(user => this.currentUser = user);
        return true; // loggged/unlogged
    }

    getCollaboratorsByProjectId(id: number): Observable<UserEmail[]> {
        return this.http.get<UserEmail[]>(address + '/collaborator/project/' + id, {responseType: 'json'});
     }

    getSupervisorByProjectId(id: number): Observable<User> {
        return this.http.get<User>(address + '/collaborator/supervisor/project/' + id, {responseType: 'json'});
     }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(address + '/user/' + id, {responseType: 'json'});
     }
}
