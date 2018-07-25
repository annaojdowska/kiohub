import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';

export class UserService {

private currentUser: boolean; // only temporarily, later will have interface User

constructor(@Inject(HttpClient) private http: HttpClient) { }

    getCurrentUser(): boolean {
        // return this.currentUser
        // ? this.currentUser
        // : this.http.get('api/login/currentUser', {responseType: 'json'}).subscribe(user => this.currentUser = user);
        return true; // loggged/unlogged
    }
}
