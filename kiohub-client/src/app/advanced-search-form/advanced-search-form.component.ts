import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ProjectType } from '../model/project-type.interface';
import { Licence } from '../model/licence.interface';
import { ProjectTypeService } from '../services/project-type-service';
import { LicenceService } from '../services/licence-service';
import { Semester } from '../model/semester.interface';
import { MatDatepickerInput, MatDatepickerInputEvent } from '../../../node_modules/@angular/material';
import { SemesterChooserComponent } from '../semester-chooser/semester-chooser.component';

@Component({
  selector: 'app-advanced-search-form',
  templateUrl: './advanced-search-form.component.html',
  styleUrls: ['./advanced-search-form.component.css'],
})

export class AdvancedSearchFormComponent implements OnInit {
  @ViewChild('supervisorInput') supervisorInput: any;
  @ViewChild('titleInput') titleInput: any;
  @ViewChild('descriptionInput') descriptionInput: any;
  @ViewChild('tagInput') tagInput: any;
  @ViewChild('dateInput1') dateInputFrom: MatDatepickerInput<Date>;
  @ViewChild('dateInput2') dateInputTo: MatDatepickerInput<Date>;
  selectedType: ProjectType;
  selectedLicence: Licence;
  dateFrom: Date;
  dateTo: Date;
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

  submit() {
    console.log(this.supervisorInput.nativeElement.value);
    console.log(this.tagInput.nativeElement.value);
    console.log(this.titleInput.nativeElement.value);
    console.log(this.descriptionInput.nativeElement.value);
    console.log(this.selectedLicence);
    console.log(this.selectedType);
    console.log(this.chosenSemesters);
    console.log(this.dateFrom);
    console.log(this.dateTo);
  }

  public dateFromChanged(type: string, event: MatDatepickerInputEvent<Date>): void {
    this.dateFrom = event.value;
  }

  public dateToChanged(type: string, event: MatDatepickerInputEvent<Date>): void {
    this.dateTo = event.value;
  }
}
