import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { LoginService } from '../services/login.service';
import { UserPinnedProjectsService } from '../services/user-pinned-projects.service';

@Component({
  selector: 'app-search-result-single-project-options',
  templateUrl: './search-result-single-project-options.component.html',
  styleUrls: ['./search-result-single-project-options.component.css']
})
export class SearchResultSingleProjectOptionsComponent {

  pinText: string;
  @Input() pinned = false;
  @Input() allowEdit = true;
  @Input() allowPin = true;
  @Input() projectId: number;
  @Output() pinOptionsUpdate = new EventEmitter();

  PIN = 'PIN';
  EDIT = 'EDIT';

  constructor(
    @Inject(UserPinnedProjectsService) private userPinnedProjects: UserPinnedProjectsService,
    @Inject(LoginService) private loginService: LoginService,
    @Inject(Router) private router: Router) { }

  pinnedTextRefresh() {
    if (this.pinned) {
      this.pinText = 'Odepnij';
    } else {
      this.pinText = 'Przypnij';
    }
  }

  selectChange(value: string) {
    this.loginService.getLogged().subscribe(user => {
      if (user) {
        const userId = user.id;

        switch (value) {
          case this.PIN:
            if (this.pinned) {
              this.userPinnedProjects.unPin(userId, this.projectId).subscribe(data => {
                this.pinned = false;
                this.pinnedTextRefresh();
                this.pinOptionsUpdate.emit();
              });
            } else {
              this.userPinnedProjects.pin(userId, this.projectId).subscribe(data => {
                this.pinned = true;
                this.pinnedTextRefresh();
                this.pinOptionsUpdate.emit();
              });
            }
            break;
          case this.EDIT:
            this.router.navigate(['/edit-project', this.projectId]);
            break;
        }
      }
    });
  }
}
