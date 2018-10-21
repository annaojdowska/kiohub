import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { LicenceService } from '../services/licence-service';
import { Licence } from '../model/licence.interface';
import { ProjectTypeService } from '../services/project-type-service';
import { ProjectType } from '../model/project-type.interface';
import { Status } from '../model/status.interface';
import { ProjectStatusService } from '../services/project-status-service';
import { InputListComponent } from '../input-list/input-list.component';
import { Semester } from '../model/semester.interface';
import { MatDatepickerInputEvent, MatInput, MatDatepickerInput } from '../../../node_modules/@angular/material';
import { InputListElement } from '../model/input-list-element';
import { QueryDescription } from '../model/helpers/query-description.class';
import { Validation } from '../error-info/validation-patterns';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { IAdvancedSearchFormValidation } from '../search/iadvanced-search-form';
import { AdvancedSearchFormValidation } from '../search/advanced-search-form-validation';
import { SearchType } from '../search/search-type.enum';

@Component({
  selector: 'app-my-projects-search-form',
  templateUrl: './my-projects-search-form.component.html',
  styleUrls: ['./my-projects-search-form.component.css']
})
export class MyProjectsSearchFormComponent implements OnInit, IAdvancedSearchFormValidation {
  @Output() filtersSubmitted = new EventEmitter<QueryDescription>();
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
  dateInputFrom: MatDatepickerInput<Date>;
  dateInputTo: MatDatepickerInput<Date>;
  supervisorInput = null;
  descriptionInput = null;
  errorSupervisor = null;
  errorDescription = null;
  enteredDateFrom: Date;
  enteredDateTo: Date;

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

  constructor(@Inject(LicenceService) private licenceService: LicenceService,
    @Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
    @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService) { }

  ngOnInit() {
    this.chosenSemesters = [];
    this.semestersHidden = false;
    this.licenceService.getLicences().subscribe(result => this.licences = result);
    this.projectTypeService.getTypes().subscribe(result => this.project_types = result);
    this.projectStatusService.getStatuses().subscribe(result => this.statuses = result);
  }

  submit() {
    if (this.formVal.validateAllElements()) {
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

      this.filtersSubmitted.emit(query);
      this.searchError.setDisplay(false);
    } else {
      this.searchError.setDisplay(true);
    }
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
    // co znaczy -1? warto to wrzucić jako stałe pole klasy
    // AO: to znaczy, ze nie ma takiego elementu w liście. Wtedy zwraca indeks -1.
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

  addStatus() {
    const index = this.statusesList.elements.findIndex(type => type.name === this.selectedStatus.name);
    if (index === -1) {
      this.statusesList.add({ name: this.selectedStatus.name });
    }
  }

  public dateFromChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateFrom = event.value;
  }

  public dateToChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateTo = event.value;
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


  checkValidityTitle() {
    return this.validation.validate(this.errorTitle, this.validation.validateInputWithPattern(this.titleInput));
  }

  checkValidityDates(from: Date, to: Date) {
    return this.validation.validate(this.errorDate, this.validation.validateDatesOrder(from, to));
  }

  checkValidityDatesNotNull(from: Date, to: Date) {
    return this.validation.validate(this.errorDate, this.validation.validateDatesOrderNotNull(from, to));
  }

  checkValidityTag() {
    return this.validation.validate(this.errorTag, this.validation.validateInputTag(this.tagInput));
  }

}
