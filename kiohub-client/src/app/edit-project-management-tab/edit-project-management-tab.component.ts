import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
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
  @ViewChild('collaboratorsList') collaboratorsList: InputListComponent;
  getProjectIdFromRouter() {
    let id: number;
    this.route.params.subscribe(routeParams => {
      id = routeParams.id;
    });
    return id;
  }
  constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
              @Inject(ProjectService) private projectService: ProjectService,
              @Inject(UserService) private userService: UserService) { }


  ngOnInit() {
    const projectId = this.getProjectIdFromRouter();
    this.projectService.getProjectById(projectId).subscribe(result => {
      this.editedProject = result;
      this.userService.getCollaboratorsByProjectId(projectId).subscribe(c => {
        this.collaborators = c;
        c.forEach(coll => {
          this.collaboratorsList.add({ id: coll.id, name: coll.firstName + ' ' + coll.lastName + ' (' + coll.email + ')'});
        });
      });
      this.userService.getSupervisorByProjectId(projectId).subscribe(s => this.supervisor = s);
    });
  }

  private getInputListElementFile(event): InputListElement {
    return { name: event.target.files[0].name, file: event.target.files[0] };
  }

  addCollaborator(event) {
    this.collaboratorsList.add(this.getInputListElementFile(event));
  }

  deleteProject() {
    alert('Usunięto projekt :(');
  }

}
