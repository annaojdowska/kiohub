import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';
import { ValueUtils } from '../utils/value-utils';

@Injectable({
  providedIn: 'root'
})
export class SupervisorGuard implements CanActivate {
  private valueUtils = new ValueUtils();

  constructor(
    @Inject(Router) private router: Router,
    @Inject(UserService) private userService: UserService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isLoggedAndSupervisor().pipe(map(isLoggedAndSupervisor => {
      if (isLoggedAndSupervisor) {
        return true;
      } else {
        this.valueUtils.saveToSession(this.valueUtils.unauthorizedBoolean, true);
        this.router.navigate(['/home']);
        return false;
      }
    }
    ));
  }
}
