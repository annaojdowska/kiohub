import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.interface';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { InputListComponent } from '../input-list/input-list.component';
import { InputListElement } from '../model/input-list-element';

@Component({
  selector: 'app-edit-project-management-tab',
  templateUrl: './edit-project-management-tab.component.html',
  styleUrls: ['./edit-project-management-tab.component.css']
})
export class EditProjectManagementTabComponent implements OnInit {
  editedProject: Project;
  supervisor: User;
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
        c.forEach(coll => {
          this.authorsList.add({ id: coll.id, name: coll.firstName + ' ' + coll.lastName + ' (' + coll.email + ')'});
        });
      });
      this.userService.getSupervisorByProjectId(projectId).subscribe(s => this.supervisor = s);
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
}
