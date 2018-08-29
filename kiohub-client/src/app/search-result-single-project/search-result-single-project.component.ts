import { Component, OnInit, Input, Inject } from '@angular/core';
import { Project } from '../model/project.interface';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-search-result-single-project',
  templateUrl: './search-result-single-project.component.html',
  styleUrls: ['./search-result-single-project.component.css']
})
export class SearchResultSingleProjectComponent implements OnInit {
  @Input() project: Project;
  private descriptionToDisplay: string;
  private numberOfCharsToDisplay = 300;
  constructor(@Inject(Router) private router: Router) { }

  ngOnInit() {
    if (this.project.description.length > this.numberOfCharsToDisplay) {
      this.descriptionToDisplay = this.project.description.slice(0, this.numberOfCharsToDisplay);
      this.descriptionToDisplay += '...';
    } else {
    this.descriptionToDisplay = this.project.description;
    }
  }

  navigateToDetails() {
    this.router.navigate(['/details', this.project.id]);
  }
}
