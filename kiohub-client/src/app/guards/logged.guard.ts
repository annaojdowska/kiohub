import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(
    @Inject(Router) private router: Router,
    @Inject(LoginService) private loginService: LoginService,
    @Inject(UserService) private userService: UserService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isLogged().pipe(map(isLogged => {
      console.log('niby odebrało że zalogowany lub nie ' + isLogged);
      if (isLogged) {
        return true;
      } else {
        this.router.navigate(['/projects-base']);
        return false;
      }
    }
  ));
  }
}
