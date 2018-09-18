import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ProjectType } from '../model/project-type.interface';
import { Licence } from '../model/licence.interface';
import { ProjectTypeService } from '../services/project-type-service';
import { LicenceService } from '../services/licence-service';
import { Semester } from '../model/semester.interface';
import { MatDatepickerInput, MatDatepickerInputEvent } from '../../../node_modules/@angular/material';
import { SemesterChooserComponent } from '../semester-chooser/semester-chooser.component';
import { InputListComponent } from '../input-list/input-list.component';
import { InputListElement } from '../model/input-list-element';

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
  @ViewChild('tagsList') tagsList: InputListComponent;
  @ViewChild('supervisorsList') supervisorsList: InputListComponent;
  @ViewChild('titlesList') titlesList: InputListComponent;
  @ViewChild('descriptionsList') descriptionsList: InputListComponent;
  @ViewChild('licencesList') licencesList: InputListComponent;
  @ViewChild('typesList') typesList: InputListComponent;
  @ViewChild('semestersList') semestersList: InputListComponent;
  chosenSemesters: Semester[];
  selectedType: ProjectType;
  selectedLicence: Licence;
  dateFrom: Date;
  dateTo: Date;

  licences: Licence[];
  project_types: ProjectType[];
  semestersHidden: boolean;
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
    const toRemove = this.semestersList.elements.find(element => element.name === semester.name);
    this.semestersList.remove(toRemove);
    const index = this.chosenSemesters.findIndex(sem => sem.id === semester.id);
    this.chosenSemesters.splice(index, 1);
  }

  semesterRemovedFromList(element: InputListElement) {
    const index = this.chosenSemesters.findIndex(sem => sem.name === element.name);
    if (index !== -1) {
      this.chosenSemesters.splice(index, 1);
    }
  }

  showAddedSemester(semester: Semester) {
    this.chosenSemesters.push(semester);
    this.semestersList.add({name: semester.name});
  }

  public dateFromChanged(type: string, event: MatDatepickerInputEvent<Date>): void {
    this.dateFrom = event.value;
  }

  public dateToChanged(type: string, event: MatDatepickerInputEvent<Date>): void {
    this.dateTo = event.value;
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

  addTag() {
    this.tagsList.add({name: this.tagInput.nativeElement.value});
    this.tagInput.nativeElement.value = '';
  }

  addSupervisor() {
    this.supervisorsList.add({name: this.supervisorInput.nativeElement.value});
    this.supervisorInput.nativeElement.value = '';
  }
  addTitle() {
    this.titlesList.add({name: this.titleInput.nativeElement.value});
    this.titleInput.nativeElement.value = '';
  }
  addDescription() {
    this.descriptionsList.add({name: this.descriptionInput.nativeElement.value});
    this.descriptionInput.nativeElement.value = '';
  }

  addLicence() {
    const index = this.licencesList.elements.findIndex(licence => licence.name === this.selectedLicence.name);
    if (index === -1) {
      this.licencesList.add({name: this.selectedLicence.name});
    }
  }

  addType() {
    const index = this.typesList.elements.findIndex(type => type.name === this.selectedType.name);
    if (index === -1) {
      this.typesList.add({name: this.selectedType.name});
    }
  }
}
