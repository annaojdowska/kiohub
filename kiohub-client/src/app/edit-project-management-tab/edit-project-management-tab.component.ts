import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.interface';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { InputListComponent } from '../input-list/input-list.component';
import { UserEmail } from '../model/user-email.interface';
import { Visibility } from '../model/visibility.enum';
import { ProjectCollaborator } from '../model/project-collaborator';

@Component({
  selector: 'app-edit-project-management-tab',
  templateUrl: './edit-project-management-tab.component.html',
  styleUrls: ['./edit-project-management-tab.component.css']
})
export class EditProjectManagementTabComponent implements OnInit {
  editedProject: Project;
  supervisor: User;
  collaborators: UserEmail[] = [];
  supervisorVisibility: Visibility;
  collaboratorsVisibility: Visibility[] = [];
  @ViewChild('authorsList') authorsList: InputListComponent;
  @ViewChild('authorInput') authorInput: any;
  getProjectIdFromRouter() {
    let id: number;
    this.route.params.subscribe(routeParams => {
      id = routeParams.id;
    });
    return id;
  }
  constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(ProjectService) private projectService: ProjectService,
    @Inject(UserService) private userService: UserService,
    @Inject(Router) private router: Router) { }


  ngOnInit() {
    const projectId = this.getProjectIdFromRouter();
    this.projectService.getProjectById(projectId).subscribe(result => {
      this.editedProject = result;
      this.userService.getCollaboratorsByProjectId(projectId).subscribe(c => {
        this.collaborators = c;
        const projectCollaborators: ProjectCollaborator[] = [];
        this.userService.getCollaboratorsDataByProjectId(projectId).subscribe(pc => {
          c.forEach(coll => {
            console.log('ProjeCollab ' + pc.length + ' ' + pc[0].userDataVisible);
            console.log(coll.id);
            const pcTmp = pc.find(p => p.userId === coll.id);
            this.authorsList.add({
              id: coll.id, name: coll.user.firstName + ' ' + coll.user.lastName + ' (' + coll.email + ')',
              visibility: (pcTmp && pcTmp.userDataVisible) ? pcTmp.userDataVisible : Visibility.LOGGED_USERS
            });
          });
        });
      });
      this.userService.getSupervisorByProjectId(projectId).subscribe(s => this.supervisor = s);
      this.userService.getSupervisorDataByProjectId(projectId).subscribe(sd => {
        if (sd && sd.userDataVisible) {
          this.supervisorVisibility = sd.userDataVisible;
        } else {
          this.supervisorVisibility = Visibility.EVERYONE;
        }
      });
    });
  }

  addAuthor() {
    const author = this.authorInput.nativeElement.value;
    this.authorInput.nativeElement.value = '';
    this.authorsList.add({ name: author });
  }

  deleteProject() {
    this.projectService.deleteProject(this.editedProject.id).subscribe(result => console.log(result));
    // if success
    this.router.navigate(['home']);
  }
  selectionSuperUserVisibilityChange(value: Visibility) {
    this.supervisorVisibility = value;
  }

  updateProject() {
    this.authorsList.elements.forEach(th => {
      if (th.id) {
        this.updateVisibility(th.id, th.visibility);
      }
    });
    this.updateVisibility(this.supervisor.id, this.supervisorVisibility);
  }

  private updateVisibility(userId: number, visibility: Visibility) {
    this.userService.updateVisibility(this.editedProject.id, userId, visibility)
      .subscribe(data => {
        console.log('ERROR: Pomyślnie zaktualizowano widocznosci danych uzytkownika ' + userId + '. ');
      },
        error => {
          console.log('ERROR: Wystąpił błąd aktualizacji widocznosci danych uzytkownika ' + userId + '. ' + error);
        });
  }
}
