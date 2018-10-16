import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LicenceService } from '../services/licence-service';
import { Licence } from '../model/licence.interface';
import { ProjectTypeService } from '../services/project-type-service';
import { ProjectType } from '../model/project-type.interface';
import { Status } from '../model/status.interface';
import { ProjectStatusService } from '../services/project-status-service';
import { InputListComponent } from '../input-list/input-list.component';
import { Semester } from '../model/semester.interface';
import { MatDatepickerInputEvent, MatInput } from '../../../node_modules/@angular/material';
import { InputListElement } from '../model/input-list-element';

@Component({
  selector: 'app-my-projects-search-form',
  templateUrl: './my-projects-search-form.component.html',
  styleUrls: ['./my-projects-search-form.component.css']
})
export class MyProjectsSearchFormComponent implements OnInit {
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
    // TODO
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
  }

  canExecuteClearFilters(): boolean {
    return this.titlesList.elements.length > 0 || this.tagsList.elements.length > 0 || this.licencesList.elements.length > 0
      || this.typesList.elements.length > 0 || this.statusesList.elements.length > 0 || this.chosenSemesters.length > 0
      || this.dateFrom !== undefined || this.dateTo !== undefined;
  }

  addTitle() {
      this.titlesList.add({ name: this.titleInput.nativeElement.value });
      this.titleInput.nativeElement.value = '';
  }

  addTag() {
      this.tagsList.add({ name: this.tagInput.nativeElement.value });
      this.tagInput.nativeElement.value = '';
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

}
