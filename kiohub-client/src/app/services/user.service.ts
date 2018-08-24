import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { User } from '../model/user.interface';
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

    getCollaboratorsByProjectId(id: number): Observable<User[]> {
        return this.http.get<User[]>('http://kiohub.eti.pg.gda.pl:8080/collaborator/project/' + id, {responseType: 'json'});
     }

    getSupervisorByProjectId(id: number): Observable<User> {
        return this.http.get<User>('http://kiohub.eti.pg.gda.pl:8080/collaborator/supervisor/project/' + id, {responseType: 'json'});
     }
}
