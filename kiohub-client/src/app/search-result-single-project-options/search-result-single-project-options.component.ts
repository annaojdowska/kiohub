import { Component, OnInit, Input, Inject, AfterContentInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { UserPinnedProjectsService } from '../services/user-pinned-projects.service';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';

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

  PIN = 'PIN';
  EDIT = 'EDIT';



  constructor(
    @Inject(UserPinnedProjectsService) private userPinnedProjects: UserPinnedProjectsService,
    @Inject(LoginService) private loginService: LoginService,
    @Inject(Router) private router: Router) { }

  pinnedTextRefresh() {
    console.log('aktualizuje przypiecie tekst ' + this.pinned);
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
              console.log('ok pinnded:' + this.pinned);
              });
            } else {
              this.userPinnedProjects.pin(userId, this.projectId).subscribe(data => {
                this.pinned = true;
                this.pinnedTextRefresh();
              console.log('ok pinnded:' + this.pinned);
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