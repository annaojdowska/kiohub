import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { map } from '../../../node_modules/rxjs/operators';
import { UserService } from '../services/user.service';
import { ValueUtils } from '../utils/value-utils';

@Injectable({
  providedIn: 'root'
})
export class PublishedGuard implements CanActivate {
  private valueUtils = new ValueUtils();

  constructor(
    @Inject(Router) private router: Router,
    @Inject(ProjectService) private projectService: ProjectService,
    @Inject(UserService) private userService: UserService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const editedProjectId: number = Number.parseInt(next.url[1].toString());
    if (editedProjectId && !Number.isNaN(editedProjectId)) {
      return this.projectService.isProjectPublishedOrUserIsCollaborator(editedProjectId).pipe<boolean>(map(response => {
        if (response) {
          return true;
        } else {
          this.valueUtils.saveToSession(this.valueUtils.unauthorizedBoolean, true);
          this.router.navigate(['/home']);
          return false;
        }
      }));
    } else {
      this.valueUtils.saveToSession(this.valueUtils.unauthorizedBoolean, true);
      this.router.navigate(['/home']);
      return false;
    }
  }
}
