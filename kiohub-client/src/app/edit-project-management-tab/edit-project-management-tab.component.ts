import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.interface';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { InputListComponent } from '../input-list/input-list.component';
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
  supervisorVisibility: Visibility;
  collaboratorsVisibility: Visibility[];
  collaborators: User[];
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
        let projectCollaborators: ProjectCollaborator[];
        this.userService.getCollaboratorsDataByProjectId(projectId).subscribe(pc => {
          projectCollaborators = pc;
        });
        c.forEach(coll => {
          const pcTmp = projectCollaborators.find(p => p.userId === coll.id);
          if (pcTmp) {
            this.collaboratorsVisibility.push(pcTmp.userDataVisible);
          } else {
            this.collaboratorsVisibility.push(Visibility.LOGGED_USERS);
          }
          // FIXME
         // this.authorsList.add({ id: coll.id, name: coll.firstName + ' ' + coll.lastName + ' (' + coll.email + ')'});

        });
      });
      this.userService.getSupervisorByProjectId(projectId).subscribe(s => this.supervisor = s);
      this.userService.getSupervisorDataByProjectId(projectId).subscribe(s => this.supervisorVisibility = s.userDataVisible);
    });
  }

  addAuthor() {
    const author = this.authorInput.nativeElement.value;
    this.authorInput.nativeElement.value = '';
    this.authorsList.add({name: author});
  }

  deleteProject() {
    this.projectService.deleteProject(this.editedProject.id).subscribe(result => console.log(result));
    // if success
    this.router.navigate(['home']);
  }

  selectionSuperUserVisibilityChange(value: Visibility) {
    this.supervisorVisibility = value;
  }

  selectionCollaboratorVisibilityChange(user: User, visibility: Visibility) {
    const index = this.collaborators.indexOf(user);
    this.collaboratorsVisibility[index] = visibility;
  }
}
