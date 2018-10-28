import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(
    @Inject(Router) private router: Router,
    @Inject(UserService) private userService: UserService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isLogged().pipe(map(isLogged => {
      if (isLogged) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    }
  ));
  }
}
