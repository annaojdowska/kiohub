import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { LicenceService } from '../services/licence-service';
import { Licence } from '../model/licence.interface';
import { ProjectTypeService } from '../services/project-type-service';
import { ProjectType } from '../model/project-type.interface';
import { Status } from '../model/status.interface';
import { ProjectStatusService } from '../services/project-status-service';
import { InputListComponent } from '../input-list/input-list.component';
import { Semester } from '../model/semester.class';
import { MatDatepickerInputEvent, MatInput, MatDatepickerInput } from '@angular/material';
import { InputListElement } from '../model/input-list-element';
import { QueryDescription, FILTER_DATE_FROM, FILTER_DATE_TO,
   FILTER_STATUS, FILTER_LICENCES, FILTER_SEMESTERS, FILTER_TAGS,
   FILTER_TITLES, FILTER_TYPES } from '../model/helpers/query-description.class';
import { Validation } from '../utils/validation-patterns';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { IAdvancedSearchFormValidation } from '../search/iadvanced-search-form';
import { AdvancedSearchFormValidation } from '../search/advanced-search-form-validation';
import { SearchType } from '../search/search-type.enum';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-my-projects-search-form',
  templateUrl: './my-projects-search-form.component.html',
  styleUrls: ['./my-projects-search-form.component.css']
})
export class MyProjectsSearchFormComponent implements OnInit, IAdvancedSearchFormValidation {
  @Output() filtersSubmitted = new EventEmitter<QueryDescription>();
  @Output() removeFilters = new EventEmitter();
  @ViewChild('titleInput') titleInput: any;
  @ViewChild('tagInput') tagInput: any;
  @ViewChild('dateInput1', { read: MatInput }) dateInput1: MatInput;
  @ViewChild('dateInput2', { read: MatInput }) dateInput2: MatInput;

  @ViewChild('titlesList') titlesList: InputListComponent;
  @ViewChild('tagsList') tagsList: InputListComponent;
  @ViewChild('licencesList') licencesList: InputListComponent;
  @ViewChild('typesList') typesList: InputListComponent;
  @ViewChild('statusesList') statusesList: InputListComponent;
  @ViewChild('semestersList') semestersList: InputListComponent;

  // errors
  @ViewChild('errorTag') errorTag: ErrorInfoComponent;
  @ViewChild('errorTitle') errorTitle: ErrorInfoComponent;
  @ViewChild('errorDate') errorDate: ErrorInfoComponent;
  @ViewChild('searchError') searchError: ErrorInfoComponent;


  tagTooltip = 'Wpisz tag i zatwierdź, klikając "Enter".';
  titleTooltip = 'Wpisz tytuł projektu i zatwierdź, klikając "Enter".';
  semesterTooltip = 'Kliknij tu, aby wybrać semestry, w czasie których wytwarzany był projekt.';
  dateInputFrom: MatDatepickerInput<Date>;
  dateInputTo: MatDatepickerInput<Date>;
  supervisorInput = null;
  descriptionInput = null;
  errorSupervisor = null;
  errorDescription = null;
  enteredDateFrom: Date;
  enteredDateTo: Date;
  sessionDateTo: Date;
  sessionDateFrom: Date;

  chosenSemesters: Semester[];
  selectedType: ProjectType;
  selectedLicence: Licence;
  selectedStatus: Status;
  dateFrom: Date;
  dateTo: Date;
  licences: Licence[];
  project_types: ProjectType[];
  statuses: Status[];
  semestersHidden: boolean;
  validation = new Validation();
  formVal = new AdvancedSearchFormValidation(this, SearchType.MY_PROJECTS);
  valueUtils = new ValueUtils();

  constructor(@Inject(LicenceService) private licenceService: LicenceService,
    @Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
    @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService) { }

  ngOnInit() {
    this.chosenSemesters = [];
    this.semestersHidden = false;
    this.licenceService.getLicences().subscribe(licences => {
      this.licences = licences;
      this.projectTypeService.getTypes().subscribe(types => {
        this.project_types = types;
        this.projectStatusService.getStatuses().subscribe(statuses => {
          this.statuses = statuses;
          this.restoreFromSession();
          this.filtersSubmitted.emit(this.generateQuery());
        });
      });
    });
  }

  submit() {
    this.addTag();
    this.addTitle();
    this.selectedLicence = undefined;
    this.selectedType = undefined;
    this.selectedStatus = undefined;
    if (this.formVal.validateAllElements()) {
      const query = this.generateQuery();

      this.saveToSession(query);
      this.filtersSubmitted.emit(query);
      this.searchError.setDisplay(false);
    } else {
      this.searchError.setDisplay(true);
    }
  }

  generateQuery(): QueryDescription {
    const query = new QueryDescription();
      this.tagsList.elements.map(element => element.name).forEach(name => query.tags.push(name));
      this.titlesList.elements.map(element => element.name).forEach(name => query.titles.push(name));
      query.dateFrom = this.dateFrom;
      query.dateTo = this.dateTo;
      this.licences.filter(licence =>
        this.licencesList.elements.map(element => element.name).findIndex(chosen => chosen === licence.name) !== -1
      ).forEach(licence => query.licencesIds.push(licence.id));
      this.project_types.filter(type =>
        this.typesList.elements.map(element => element.name).findIndex(chosen => chosen === type.name) !== -1
      ).forEach(type => query.projectTypesIds.push(type.id));
      this.chosenSemesters.forEach(semester => query.semestersIds.push(semester.id));
      this.statuses.filter(status =>
        this.statusesList.elements.map(element => element.name).findIndex(chosen => chosen === status.name) !== -1
      ).forEach(status => query.statusesIds.push(status.id));
      return query;
  }

  clearFilters() {
    this.titleInput.nativeElement.value = '';
    this.titlesList.elements = [];
    this.tagInput.nativeElement.value = '';
    this.tagsList.elements = [];
    this.selectedLicence = undefined;
    this.licencesList.elements = [];
    this.selectedType = undefined;
    this.typesList.elements = [];
    this.selectedStatus = undefined;
    this.statusesList.elements = [];
    this.semestersList.elements.forEach(element => this.semesterRemovedFromList(element));
    this.semestersList.elements = [];
    this.dateInput1.value = '';
    this.dateFrom = undefined;
    this.dateInput2.value = '';
    this.dateTo = undefined;

    this.enteredDateFrom = undefined;
    this.enteredDateTo = undefined;

    this.searchError.setDisplay(false);
    this.errorDate.setDisplay(false);
    this.errorTag.setDisplay(false);
    this.errorTitle.setDisplay(false);

    this.valueUtils.getAndRemoveFromSession(FILTER_DATE_FROM);
    this.valueUtils.getAndRemoveFromSession(FILTER_DATE_TO);
    this.valueUtils.getAndRemoveFromSession(FILTER_STATUS);
    this.valueUtils.getAndRemoveFromSession(FILTER_LICENCES);
    this.valueUtils.getAndRemoveFromSession(FILTER_SEMESTERS);
    this.valueUtils.getAndRemoveFromSession(FILTER_TAGS);
    this.valueUtils.getAndRemoveFromSession(FILTER_TITLES);
    this.valueUtils.getAndRemoveFromSession(FILTER_TYPES);

    this.removeFilters.emit();
  }

  canExecuteClearFilters(): boolean {
    return this.titlesList.elements.length > 0 || this.tagsList.elements.length > 0 || this.licencesList.elements.length > 0
      || this.typesList.elements.length > 0 || this.statusesList.elements.length > 0 || this.chosenSemesters.length > 0
      || this.dateFrom !== undefined || this.dateTo !== undefined;
  }

  addTitle() {
    if (this.formVal.checkValidityTitle()) {
      this.titlesList.add({ name: this.titleInput.nativeElement.value });
      this.titleInput.nativeElement.value = '';
    }
  }

  addTag() {
    if (this.formVal.checkValidityTag()) {
      this.tagsList.add({ name: this.tagInput.nativeElement.value });
      this.tagInput.nativeElement.value = '';
    }
  }

  addLicence() {
    const index = this.licencesList.elements.findIndex(licence => licence.name === this.selectedLicence.name);
    if (index === -1) {
      this.licencesList.elements = [];
      this.licencesList.add({ name: this.selectedLicence.name });
    }
  }

  addType() {
    const index = this.typesList.elements.findIndex(type => type.name === this.selectedType.name);
    if (index === -1) {
      this.typesList.elements = [];
      this.typesList.add({ name: this.selectedType.name });
    }
  }

  addStatus() {
    const index = this.statusesList.elements.findIndex(type => type.name === this.selectedStatus.name);
    if (index === -1) {
      this.statusesList.elements = [];
      this.statusesList.add({ name: this.selectedStatus.name });
    }
  }

  toggleSemesters() {
    this.semestersHidden = !this.semestersHidden;
  }

  removeAddedSemester(semester: Semester) {
    const index = this.chosenSemesters.findIndex(sem => sem.id === semester.id);
    this.chosenSemesters.splice(index, 1);
    const toRemove = this.semestersList.elements.find(element => element.name === semester.name);
    this.semestersList.remove(toRemove);
  }

  semesterRemovedFromList(element: InputListElement) {
    const index = this.chosenSemesters.findIndex(sem => sem.name === element.name);
    if (index !== -1) {
      this.chosenSemesters.splice(index, 1);
    }
  }

  showAddedSemester(semester: Semester) {
    this.chosenSemesters.push(semester);
    this.semestersList.add({ name: semester.name });
  }

  clearDatePicker1() {
    this.dateInput1.value = '';
    this.dateFrom = undefined;
  }

  clearDatePicker2() {
    this.dateInput2.value = '';
    this.dateTo = undefined;
  }

  semesterFromString(str: string): Semester {
    const array = str.split(':');
    return new Semester(Number(array[0]), array[1]);
  }

  public semesterToString(semester: Semester): string {
    return semester.id + ':' + semester.name;
}

  private saveToSession(query: QueryDescription) {
    this.valueUtils.saveToSession(FILTER_TITLES, query.titles);
    this.valueUtils.saveToSession(FILTER_LICENCES, this.licencesList.elements.map(element => element.name));
    this.valueUtils.saveToSession(FILTER_TAGS, query.tags);
    this.valueUtils.saveToSession(FILTER_DATE_FROM, query.dateFrom);
    this.valueUtils.saveToSession(FILTER_DATE_TO, query.dateTo);
    this.valueUtils.saveToSession(FILTER_STATUS, query.statusesIds);
    this.valueUtils.saveToSession(FILTER_SEMESTERS, this.chosenSemesters.map(semester => this.semesterToString(semester)));
  }

  private restoreFromSession() {
    const titles = this.valueUtils.getDataFromSessionStorage(FILTER_TITLES);
    if (titles && titles.length > 0) {
      titles.split(',').forEach(str => this.titlesList.add({ name: str }));
    }
    const status = this.valueUtils.getDataFromSessionStorage(FILTER_STATUS);
    if (status && status.length > 0) {
      status.split(',').forEach(str => this.statusesList.add({ name: str }));
    }
    const tags = this.valueUtils.getDataFromSessionStorage(FILTER_TAGS);
    if (tags && tags.length > 0) {
      tags.split(',').forEach(str => this.tagsList.add({ name: str }));
    }
    const licences = this.valueUtils.getDataFromSessionStorage(FILTER_LICENCES);
    if (licences && licences.length > 0) {
      licences.split(',').forEach(str => this.licencesList.add({ name: str }));
    }
    const types = this.valueUtils.getDataFromSessionStorage(FILTER_TYPES);
    if (types && types.length > 0) {
      types.split(',').forEach(str => this.typesList.add({ name: str }));
    }
    const semesters = this.valueUtils.getDataFromSessionStorage(FILTER_SEMESTERS);
    if (semesters && semesters.length > 0) {
      semesters.split(',').forEach(str => this.showAddedSemester(this.semesterFromString(str)));
    }
    const dateFrom = this.valueUtils.getDataFromSessionStorage(FILTER_DATE_FROM);
    if (dateFrom && dateFrom !== 'undefined') {
      this.dateFrom = new Date(dateFrom);
    }
    const dateTo = this.valueUtils.getDataFromSessionStorage(FILTER_DATE_TO);
    if (dateTo && dateTo !== 'undefined') {
      this.dateTo = new Date(dateTo);
    }
  }
}
