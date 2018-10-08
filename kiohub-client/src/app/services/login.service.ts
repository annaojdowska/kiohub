import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { address } from './project.service';
import { Observable } from '../../../node_modules/rxjs';
import { User } from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  login() {
    return this.http.get(address + '/login', { responseType: 'json' });
  }

  logout() {
    return this.http.get(address + '/logout', { responseType: 'json' });
  }

  isLogged(): Observable<Boolean> {
    return this.http.get<Boolean>(address + '/login/isLogged', { responseType: 'json' });
  }

  getLogged(): Observable<User> {
    return this.http.get<User>(address + '/login/getLogged', { responseType: 'json' });
  }


}
