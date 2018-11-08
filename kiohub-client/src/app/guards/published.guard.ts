import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublishedGuard implements CanActivate {

  constructor(
    @Inject(Router) private router: Router,
    @Inject(ProjectService) private projectService: ProjectService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const editedProjectId: number = Number.parseInt(next.url[1].toString());
      if (editedProjectId && !Number.isNaN(editedProjectId)) {
        return this.projectService.getProjectById(editedProjectId).pipe(map(project => {
          if (project && project.published) {
            return true;
          } else {
            this.router.navigate(['/home']);
            return false;
          }
        }));
      } else {
        return false;
      }
  }
}