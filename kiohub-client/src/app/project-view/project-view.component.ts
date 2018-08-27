import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../model/project.interface';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  supervisor: User;
  collaborators: User[];
  project: Project;
  id: number;

  constructor(@Inject(UserService) private userService: UserService,
              @Inject(ActivatedRoute) private route: ActivatedRoute,
            @Inject(ProjectService) private projectService: ProjectService) {

    // this.route.params.subscribe(routeParams => {
    //      this.id = routeParams.id;
    //      this.project = this.projectService.getProjectByIdFromCache(this.id);
    //      this.initData(this.id);
    // });
   }

   ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      this.getItem(this.id).then(project => {
        this.project = project;
        this.initData(this.project.id);
      });
    });
  }

  async getItem(id: number) {
    return await this.projectService.getProjectById(this.id).toPromise();
  }

  initData(projectId: number) {
    this.userService.getCollaboratorsByProjectId(projectId).subscribe(result => this.collaborators = result);
    this.userService.getSupervisorByProjectId(projectId).subscribe(result => this.supervisor = result);
  }
}
