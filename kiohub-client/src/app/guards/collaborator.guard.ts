import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorGuard implements CanActivate {
  constructor(
    @Inject(Router) private router: Router,
    @Inject(UserService) private userService: UserService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     console.log(next.url);
     console.log(state.url);
  //   return this.userService.loggedIsCollaborator().pipe(map(isLoggedAndSupervisor => {
  //     if (isLoggedAndSupervisor) {
  //       return true;
  //     } else {
  //       this.router.navigate(['/home']);
  //       return false;
  //     }
  //   }
  // ));
  return true;
  }
}
