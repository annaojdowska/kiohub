import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { ProjectType } from '../model/project-type.interface';
import { Licence } from '../model/licence.interface';
import { ProjectTypeService } from '../services/project-type-service';
import { LicenceService } from '../services/licence-service';
import { Semester } from '../model/semester.interface';
import { MatDatepickerInput, MatDatepickerInputEvent, MatInput } from '../../../node_modules/@angular/material';
import { InputListComponent } from '../input-list/input-list.component';
import { InputListElement } from '../model/input-list-element';
import { QueryDescription } from '../model/helpers/query-description.class';

@Component({
  selector: 'app-advanced-search-form',
  templateUrl: './advanced-search-form.component.html',
  styleUrls: ['./advanced-search-form.component.css'],
})

export class AdvancedSearchFormComponent implements OnInit {
  @Output() filtersSubmitted = new EventEmitter<QueryDescription>();
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
  @ViewChild('dateInput1', { read: MatInput }) dateInput1: MatInput;
  @ViewChild('dateInput2', { read: MatInput }) dateInput2: MatInput;

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

  public dateFromChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateFrom = event.value;
  }

  public dateToChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateTo = event.value;
  }

  submit() {
    const query = new QueryDescription();
    this.supervisorsList.elements.map(element => element.name).forEach(name => query.supervisors.push(name));
    this.tagsList.elements.map(element => element.name).forEach(name => query.tags.push(name));
    this.titlesList.elements.map(element => element.name).forEach(name => query.titles.push(name));
    this.descriptionsList.elements.map(element => element.name).forEach(name => query.descriptions.push(name));
    query.dateFrom = this.dateFrom;
    query.dateTo = this.dateTo;
    this.licences.filter(licence =>
      this.licencesList.elements.map(element => element.name).findIndex(chosen => chosen === licence.name) !== -1
    ).forEach(licence => query.licencesIds.push(licence.id));
    this.project_types.filter(type =>
      this.typesList.elements.map(element => element.name).findIndex(chosen => chosen === type.name) !== -1
    ).forEach(type => query.projectTypesIds.push(type.id));
    this.chosenSemesters.forEach(semester => query.semestersIds.push(semester.id));

    this.clearFilters();
    this.filtersSubmitted.emit(query);
  }

  clearFilters() {
    this.supervisorsList.elements = [];
    this.supervisorInput.nativeElement.value = '';
    this.tagsList.elements = [];
    this.tagInput.nativeElement.value = '';
    this.titlesList.elements = [];
    this.titleInput.nativeElement.value = '';
    this.descriptionsList.elements = [];
    this.descriptionInput.nativeElement.value = '';
    this.licencesList.elements = [];
    this.selectedLicence = undefined;
    this.typesList.elements = [];
    this.selectedType = undefined;
    this.semestersList.elements.forEach(element => this.semesterRemovedFromList(element));
    this.semestersList.elements = [];
    this.dateInput1.value = '';
    this.dateFrom = undefined;
    this.dateInput2.value = '';
    this.dateTo = undefined;
  }

  canExecuteClearFilters(): boolean {
    return this.supervisorsList.elements.length > 0 || this.tagsList.elements.length > 0 || this.titlesList.elements.length > 0
    || this.descriptionsList.elements.length > 0 || this.licencesList.elements.length > 0 || this.typesList.elements.length > 0
    || this.chosenSemesters.length > 0 || this.dateFrom !== undefined || this.dateTo !== undefined;
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
