import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../model/project.interface';

@Component({
  selector: 'app-search-result-single-project',
  templateUrl: './search-result-single-project.component.html',
  styleUrls: ['./search-result-single-project.component.css']
})
export class SearchResultSingleProjectComponent implements OnInit {
  @Input() project: Project;
  constructor() { }

  ngOnInit() {
  }

}
