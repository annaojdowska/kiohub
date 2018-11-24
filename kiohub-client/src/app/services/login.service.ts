import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '../../../node_modules/@angular/common/http';
import { address } from './project.service';
import { Observable } from '../../../node_modules/rxjs';
import { User } from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  authenticated: boolean;

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

  authenticate(credentials, callback) {
    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});

    this.isLogged().subscribe(response => {
      if (response['name']) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }
      return callback && callback();
    });
  }
}

@Injectable()
export class KiohubHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request);
  }
}
