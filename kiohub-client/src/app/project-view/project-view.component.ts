import { Component, OnInit, Inject, DoCheck, Input, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Project } from '../model/project.interface';
import { ProjectDetailsService } from '../services/project-details-service';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit, OnDestroy {
  project: Project;
  subscription: Subscription;
  constructor(@Inject(ProjectDetailsService) private projectDetailsService: ProjectDetailsService) {
    this.subscription = this.projectDetailsService.getSelectedProject().subscribe(project => { this.project = project; });
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
}

}
