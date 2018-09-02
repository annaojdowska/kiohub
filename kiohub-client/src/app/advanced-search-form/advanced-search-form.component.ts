import { Component, OnInit, Inject } from '@angular/core';

import { ProjectType } from '../model/project-type.interface';

import { Licence } from '../model/licence.interface';
import { ProjectTypeService } from '../services/project-type-service';
import { LicenceService } from '../services/licence-service';
import { Semester } from '../model/semester.interface';

@Component({
  selector: 'app-advanced-search-form',
  templateUrl: './advanced-search-form.component.html',
  styleUrls: ['./advanced-search-form.component.css'],
})

export class AdvancedSearchFormComponent implements OnInit {
  licences: Licence[];
  project_types: ProjectType[];
  semestersHidden: boolean;
  chosenSemesters: Semester[];
  constructor(@Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
              @Inject(LicenceService) private licenceService: LicenceService) { }

  ngOnInit() {
    this.chosenSemesters = [];
    this.semestersHidden = false;
    this.projectTypeService.getTypes().subscribe(result => this.project_types = result);
    this.licenceService.getLicences().subscribe(result => this.licences = result);
  }

  toggleSemesters() {
    this.semestersHidden = !this.semestersHidden;
  }

  removeAddedSemester(semester: Semester) {
    const index = this.chosenSemesters.findIndex(sem => sem.id === semester.id);
    this.chosenSemesters.splice(index, 1);
  }

  showAddedSemester(semester: Semester) {
    this.chosenSemesters.push(semester);
  }
}
