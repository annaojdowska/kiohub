import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDatepickerInput, MatInput, MatDatepicker } from '@angular/material';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { InputListComponent } from '../input-list/input-list.component';
import { QueryDescription, SEARCH_SUPERVISORS, SEARCH_TITLES, SEARCH_SEMESTERS,
  SEARCH_DATE_TO, SEARCH_DATE_FROM, SEARCH_TAGS, SEARCH_LICENCES, SEARCH_DESC,
  SEARCH_TYPES } from '../model/helpers/query-description.class';
import { InputListElement } from '../model/input-list-element';
import { Licence } from '../model/licence.interface';
import { ProjectType } from '../model/project-type.interface';
import { Semester } from '../model/semester.class';
import { AdvancedSearchFormValidation } from '../search/advanced-search-form-validation';
import { IAdvancedSearchFormValidation } from '../search/iadvanced-search-form';
import { SearchType } from '../search/search-type.enum';
import { LicenceService } from '../services/licence-service';
import { ProjectTypeService } from '../services/project-type-service';
import { Validation } from '../utils/validation-patterns';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-advanced-search-form',
  templateUrl: './advanced-search-form.component.html',
  styleUrls: ['./advanced-search-form.component.css'],
})

export class AdvancedSearchFormComponent implements OnInit, IAdvancedSearchFormValidation {
  @Output() filtersSubmitted = new EventEmitter<QueryDescription>();
  @ViewChild('supervisorInput') supervisorInput: any;
  @ViewChild('titleInput') titleInput: any;
  @ViewChild('descriptionInput') descriptionInput: any;
  @ViewChild('tagInput') tagInput: any;
  @ViewChild('dateInput1') dateInputFrom: MatDatepickerInput<Date>;
  @ViewChild('dateInput2') dateInputTo: MatDatepickerInput<Date>;
  @ViewChild('datePicker1') datePickerFrom: MatDatepicker<Date>;
  @ViewChild('dateInput2') datePickerTo: MatDatepicker<Date>;
  @ViewChild('tagsList') tagsList: InputListComponent;
  @ViewChild('supervisorsList') supervisorsList: InputListComponent;
  @ViewChild('titlesList') titlesList: InputListComponent;
  @ViewChild('descriptionsList') descriptionsList: InputListComponent;
  @ViewChild('licencesList') licencesList: InputListComponent;
  @ViewChild('typesList') typesList: InputListComponent;
  @ViewChild('semestersList') semestersList: InputListComponent;
  @ViewChild('dateInput1', { read: MatInput }) dateInput1: MatInput;
  @ViewChild('dateInput2', { read: MatInput }) dateInput2: MatInput;
  // errors
  @ViewChild('errorSupervisor') errorSupervisor: ErrorInfoComponent;
  @ViewChild('errorTag') errorTag: ErrorInfoComponent;
  @ViewChild('errorTitle') errorTitle: ErrorInfoComponent;
  @ViewChild('errorDescription') errorDescription: ErrorInfoComponent;
  @ViewChild('errorDate') errorDate: ErrorInfoComponent;
  @ViewChild('searchError') searchError: ErrorInfoComponent;

  supervisorTooltip = 'Wpisz nazwisko promotora projektu i zatwierdź, klikając "Enter".';
  tagTooltip = 'Wpisz tag i zatwierdź, klikając "Enter".';
  titleTooltip = 'Wpisz fragment tytułu projektu i zatwierdź, klikając "Enter".';
  descriptionTooltip = 'Wpisz fragment opisu projektu i zatwierdź, klikając "Enter".';
  semesterTooltip = 'Kliknij tu, aby wybrać semestry, w czasie których wytwarzany był projekt.';

  chosenSemesters: Semester[];
  selectedType: ProjectType;
  selectedLicence: Licence;
  // correctly validated dates
  dateFrom: Date;
  dateTo: Date;
  // dates provided by user (not necessarilly correct); used to validate all elements
  enteredDateFrom: Date;
  enteredDateTo: Date;
  formVal = new AdvancedSearchFormValidation(this, SearchType.PROJECTS_BASE);
  validation = new Validation();
  valueUtils = new ValueUtils();
  licences: Licence[];
  project_types: ProjectType[];
  semestersHidden: boolean;
  constructor(@Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
    @Inject(LicenceService) private licenceService: LicenceService) { }

  ngOnInit() {
    this.chosenSemesters = [];
    this.semestersHidden = false;
    this.projectTypeService.getTypes().subscribe(result => {
      this.project_types = result;
      this.licenceService.getLicences().subscribe(res => {
        this.licences = res;
        this.restoreFromSession();
        this.submit();
      });
    });
  }

  // ******** OTHER ********

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

  submit() {
    this.selectedLicence = undefined;
    this.selectedType = undefined;
    this.addTag();
    this.addSupervisor();
    this.addTitle();
    this.addDescription();
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
    return query;
  }

  private saveToSession(query: QueryDescription) {
    this.valueUtils.saveToSession(SEARCH_SUPERVISORS, query.supervisors);
    this.valueUtils.saveToSession(SEARCH_TITLES, query.titles);
    this.valueUtils.saveToSession(SEARCH_TYPES, this.typesList.elements.map(element => element.name));
    this.valueUtils.saveToSession(SEARCH_DESC, query.descriptions);
    this.valueUtils.saveToSession(SEARCH_LICENCES, this.licencesList.elements.map(element => element.name));
    this.valueUtils.saveToSession(SEARCH_TAGS, query.tags);
    this.valueUtils.saveToSession(SEARCH_DATE_FROM, query.dateFrom);
    this.valueUtils.saveToSession(SEARCH_DATE_TO, query.dateTo);
    this.valueUtils.saveToSession(SEARCH_SEMESTERS, this.chosenSemesters.map(semester => this.semesterToString(semester)));
  }

  private restoreFromSession() {
    const supervisors = this.valueUtils.getDataFromSessionStorage(SEARCH_SUPERVISORS);
    if (supervisors && supervisors.length > 0) {
      supervisors.split(',').forEach(str => this.supervisorsList.add({ name: str }));
    }
    const titles = this.valueUtils.getDataFromSessionStorage(SEARCH_TITLES);
    if (titles && titles.length > 0) {
      titles.split(',').forEach(str => this.titlesList.add({ name: str }));
    }
    const descriptions = this.valueUtils.getDataFromSessionStorage(SEARCH_DESC);
    if (descriptions && descriptions.length > 0) {
      descriptions.split(',').forEach(str => this.descriptionsList.add({ name: str }));
    }
    const tags = this.valueUtils.getDataFromSessionStorage(SEARCH_TAGS);
    if (tags && tags.length > 0) {
      tags.split(',').forEach(str => this.tagsList.add({ name: str }));
    }
    const licences = this.valueUtils.getDataFromSessionStorage(SEARCH_LICENCES);
    if (licences && licences.length > 0) {
      licences.split(',').forEach(str => this.licencesList.add({ name: str }));
    }
    const types = this.valueUtils.getDataFromSessionStorage(SEARCH_TYPES);
    if (types && types.length > 0) {
      types.split(',').forEach(str => this.typesList.add({ name: str }));
    }
    const semesters = this.valueUtils.getDataFromSessionStorage(SEARCH_SEMESTERS);
    if (semesters && semesters.length > 0) {
      semesters.split(',').forEach(str => this.showAddedSemester(this.semesterFromString(str)));
    }
    const dateFrom = this.valueUtils.getDataFromSessionStorage(SEARCH_DATE_FROM);
    if (dateFrom && dateFrom !== 'undefined') {
      this.dateFrom = new Date(dateFrom);
    }
    const dateTo = this.valueUtils.getDataFromSessionStorage(SEARCH_DATE_TO);
    if (dateTo && dateTo !== 'undefined') {
      this.dateTo = new Date(dateTo);
    }
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

    this.enteredDateFrom = undefined;
    this.enteredDateTo = undefined;

    this.searchError.setDisplay(false);
    this.errorDate.setDisplay(false);
    this.errorDescription.setDisplay(false);
    this.errorSupervisor.setDisplay(false);
    this.errorTag.setDisplay(false);
    this.errorTitle.setDisplay(false);

    this.valueUtils.getAndRemoveFromSession(SEARCH_DATE_FROM);
    this.valueUtils.getAndRemoveFromSession(SEARCH_DATE_TO);
    this.valueUtils.getAndRemoveFromSession(SEARCH_DESC);
    this.valueUtils.getAndRemoveFromSession(SEARCH_LICENCES);
    this.valueUtils.getAndRemoveFromSession(SEARCH_SEMESTERS);
    this.valueUtils.getAndRemoveFromSession(SEARCH_SUPERVISORS);
    this.valueUtils.getAndRemoveFromSession(SEARCH_TAGS);
    this.valueUtils.getAndRemoveFromSession(SEARCH_TITLES);
    this.valueUtils.getAndRemoveFromSession(SEARCH_TYPES);

    this.filtersSubmitted.emit(this.generateQuery());
  }

  canExecuteClearFilters(): boolean {
    return this.supervisorsList.elements.length > 0 || this.tagsList.elements.length > 0 || this.titlesList.elements.length > 0
      || this.descriptionsList.elements.length > 0 || this.licencesList.elements.length > 0 || this.typesList.elements.length > 0
      || this.chosenSemesters.length > 0 || this.dateFrom !== undefined || this.dateTo !== undefined;
  }

  // ******** FUNCTION CALLED WHEN ENTER HITTED ********
  addTag() {
    if (this.formVal.checkValidityTag()) {
      this.tagsList.add({ name: this.tagInput.nativeElement.value });
      this.tagInput.nativeElement.value = '';
    }
  }

  addSupervisor() {
    if (this.formVal.checkValiditySupervisor()) {
      this.supervisorsList.add({ name: this.supervisorInput.nativeElement.value });
      this.supervisorInput.nativeElement.value = '';
    }
  }

  addTitle() {
    if (this.formVal.checkValidityTitle()) {
      this.titlesList.add({ name: this.titleInput.nativeElement.value });
      this.titleInput.nativeElement.value = '';
    }
  }

  addDescription() {
    if (this.formVal.checkValidityDescription()) {
      this.descriptionsList.add({ name: this.descriptionInput.nativeElement.value });
      this.descriptionInput.nativeElement.value = '';
    }
  }

  addLicence() {
    const index = this.licencesList.elements.findIndex(licence => licence.name === this.selectedLicence.name);
    if (index === -1) {
      this.licencesList.add({ name: this.selectedLicence.name });
    }
  }

  addType() {
    const index = this.typesList.elements.findIndex(type => type.name === this.selectedType.name);
    if (index === -1) {
      this.typesList.add({ name: this.selectedType.name });
    }
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
}
