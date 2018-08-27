import { Component, OnInit, Input, Inject } from '@angular/core';
import { Project } from '../model/project.interface';
import { Router } from '../../../node_modules/@angular/router';
import { ProjectDetailsService } from '../services/project-details-service';

@Component({
  selector: 'app-search-result-single-project',
  templateUrl: './search-result-single-project.component.html',
  styleUrls: ['./search-result-single-project.component.css']
})
export class SearchResultSingleProjectComponent implements OnInit {
  @Input() project: Project;
  constructor(@Inject(Router) private router: Router,
   @Inject(ProjectDetailsService) private projectDetailsService: ProjectDetailsService) { }

  ngOnInit() {
  }

  navigateToDetails() {
    console.log(this.project);
    this.projectDetailsService.setSelectedProject(this.project);
    this.router.navigate(['/details', this.project.id]);
  }
}
