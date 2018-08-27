import { Component, OnInit, Inject, DoCheck, Input, OnDestroy } from '@angular/core';
import { Project } from '../model/project.interface';
import { ProjectDetailsService } from '../services/project-details-service';
import { Subscription } from '../../../node_modules/rxjs';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit, OnDestroy {
  supervisor: User;
  collaborators: User[];
  project: Project;
  subscription: Subscription;
  id: number;
  constructor(@Inject(ProjectDetailsService) private projectDetailsService: ProjectDetailsService,
              @Inject(UserService) private userService: UserService,
              @Inject(ActivatedRoute) private route: ActivatedRoute,
            @Inject(ProjectService) private projectService: ProjectService) {
    this.subscription = this.projectDetailsService.getSelectedProject().subscribe(project => this.initData(project));
    this.route.params.subscribe(routeParams => this.id = routeParams.id);
   }

  ngOnInit() {
    this.getItem(this.id).then(project => this.initData(project));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async getItem(id: number) {
    return await this.projectService.getProjectById(this.id).toPromise();
  }

  initData(project: Project) {
    this.project = project;
    this.userService.getCollaboratorsByProjectId(this.project.id).subscribe(result => this.collaborators = result);
    this.userService.getSupervisorByProjectId(this.project.id).subscribe(result => this.supervisor = result);
  }
}
