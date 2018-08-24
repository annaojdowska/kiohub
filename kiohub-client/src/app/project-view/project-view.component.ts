import { Component, OnInit, Inject, DoCheck, Input, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Project } from '../model/project.interface';
import { ProjectDetailsService } from '../services/project-details-service';
import { Subscription } from '../../../node_modules/rxjs';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';

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
  constructor(@Inject(ProjectDetailsService) private projectDetailsService: ProjectDetailsService,
              @Inject(UserService) private userService: UserService) {
    this.subscription = this.projectDetailsService.getSelectedProject().subscribe(project => { this.project = project; });
   }

  ngOnInit() {
    this.project = this.projectDetailsService.currentProject;
    this.userService.getCollaboratorsByProjectId(this.project.id).subscribe(result => this.collaborators = result);
    this.userService.getSupervisorByProjectId(this.project.id).subscribe(result => this.supervisor = result);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
}

}
