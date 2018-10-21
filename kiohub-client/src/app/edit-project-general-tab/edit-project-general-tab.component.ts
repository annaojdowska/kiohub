import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatDialog, MatDialogConfig } from '@angular/material';
import { Licence } from '../model/licence.interface';
import { ProjectType } from '../model/project-type.interface';
import { Status } from '../model/status.interface';
import { ProjectTypeService } from '../services/project-type-service';
import { LicenceService } from '../services/licence-service';
import { ProjectStatusService } from '../services/project-status-service';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.interface';
import { InputListElement } from '../model/input-list-element';
import { InputListComponent } from '../input-list/input-list.component';
import { AttachmentType } from '../model/attachment-type.enum';
import { AttachmentService } from '../services/attachment.service';
import { Visibility } from '../model/visibility.enum';
import { TagService } from '../services/tag.service';
import { Tag } from '../model/tag.interface';
import { ActivatedRoute } from '@angular/router';
import { Semester } from '../model/semester.interface';
import { SemesterChooserComponent } from '../semester-chooser/semester-chooser.component';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { Validation } from '../error-info/validation-patterns';
import { ValueUtils } from '../error-info/value-utils';
import { ErrorType } from '../error-info/error-type.enum';
import { SpinnerComponent } from '../ui-elements/spinner/spinner.component';
import { FileUtils } from '../error-info/file-utils';
import { injectChangeDetectorRef } from '../../../node_modules/@angular/core/src/render3';
import { PublishDialogComponent } from '../ui-elements/publish-dialog/publish-dialog.component';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-edit-project-general-tab',
  templateUrl: './edit-project-general-tab.component.html',
  styleUrls: ['./edit-project-general-tab.component.css']
})

export class EditProjectGeneralTabComponent implements OnInit {
  @ViewChild('thesisList') thesisList: InputListComponent;
  @ViewChild('programsList') programsList: InputListComponent;
  @ViewChild('imagesList') imagesList: InputListComponent;
  @ViewChild('instructionsList') instructionsList: InputListComponent;
  @ViewChild('instructionsStartList') instructionsStartList: InputListComponent;
  @ViewChild('othersList') othersList: InputListComponent;
  @ViewChild('tagsList') tagsList: InputListComponent;
  @ViewChild('relatedToList') relatedToList: InputListComponent;
  @ViewChild('tagsListComponent') tagsListComponent: any;
  @ViewChild('titlePl') titlePl: any;
  @ViewChild('descriptionPl') descriptionPl: any;
  @ViewChild('titleEn') titleEn: any;
  @ViewChild('descriptionEn') descriptionEn: any;
  @ViewChild('projectStatus') projectStatus: any;
  @ViewChild('projectType') projectType: any;
  @ViewChild('licence') licence: any;
  @ViewChild('semestersList') semestersList: InputListComponent;
  @ViewChild('semesterChooser') semesterChooser: SemesterChooserComponent;
  @ViewChild('uploadInfoSpinner') uploadInfoSpinner: SpinnerComponent;
  // errors
  @ViewChild('titlePlError') titlePlError: ErrorInfoComponent;
  @ViewChild('titleEnError') titleEnError: ErrorInfoComponent;
  @ViewChild('descriptionPlError') descriptionPlError: ErrorInfoComponent;
  @ViewChild('descriptionEnError') descriptionEnError: ErrorInfoComponent;
  @ViewChild('projectTypeError') projectTypeError: ErrorInfoComponent;
  @ViewChild('projectStatusError') projectStatusError: ErrorInfoComponent;
  @ViewChild('semesterChooserError') semesterChooserError: ErrorInfoComponent;
  @ViewChild('tagsError') tagsError: ErrorInfoComponent;
  @ViewChild('updateResult') updateResult: ErrorInfoComponent;
  @ViewChild('publishResult') publishResult: ErrorInfoComponent;
  @ViewChild('sendingInvitationsError') sendingInvitationsError: ErrorInfoComponent;
  // attachment errors
  @ViewChild('thesisError') thesisError: ErrorInfoComponent;
  @ViewChild('sourceCodeError') sourceCodeError: ErrorInfoComponent;
  @ViewChild('imageError') imageError: ErrorInfoComponent;
  @ViewChild('manualUsageError') manualUsageError: ErrorInfoComponent;
  @ViewChild('manualUsageStartupError') manualUsageStartupError: ErrorInfoComponent;
  @ViewChild('otherFileError') otherFileError: ErrorInfoComponent;

  editedProject: Project;
  statuses: Status[];
  licences: Licence[];
  project_types: ProjectType[];
  tagsToSent: string[] = [];
  tagControl = new FormControl();
  tagOptions: Tag[] = [];
  tagFilteredOptions: Observable<Tag[]>;
  chosenSemesters: Semester[];
  semestersHidden: boolean;
  nr = 0;
  validation: Validation = new Validation();
  valueUtils = new ValueUtils();
  fileUtils = new FileUtils();
  relatedToFilteredResults: Observable<Project[]>;
  relatedToControl: FormControl = new FormControl();
  projects: Project[] = [];
  projectUpdatingInProgress: boolean;

  tooltipThesis = 'Dopuszczalne rozszerzenia to: ' + this.fileUtils.getThesisExtensions()
                  + '. Maksymalny rozmiar pliku to ' + this.validation.getMaxFileSizeInMegaBytes() + '.';
  tooltipSourceCodes = 'Dopuszczalne rozszerzenia to: ' + this.fileUtils.getSourceCodeExtensions()
                      + '. Maksymalny rozmiar pliku to ' + this.validation.getMaxFileSizeInMegaBytes() + '.';
  tooltipPhotos = 'Dopuszczalne rozszerzenia to: ' + this.fileUtils.getImageExtensions()
                  + '. Maksymalny rozmiar pliku to ' + this.validation.getMaxFileSizeInMegaBytes() + '.';
  tooltipManualUsages = 'Dopuszczalne rozszerzenia to: ' + this.fileUtils.getManualExtensions()
                    + '. Maksymalny rozmiar pliku to ' + this.validation.getMaxFileSizeInMegaBytes() + '.';
  tooltipManualUsageStartups = 'Dopuszczalne rozszerzenia to: ' + this.fileUtils.getManualStartupExtensions()
                              + '. Maksymalny rozmiar pliku to ' + this.validation.getMaxFileSizeInMegaBytes() + '.';
  tooltipOtherFiles = 'Dopuszczalne rozszerzenia to: ' + this.fileUtils.getOtherFileExtensions()
                    + '. Maksymalny rozmiar pliku to ' + this.validation.getMaxFileSizeInMegaBytes() + '.';
  tooltipSemesters = 'Wybór semestrów, w czasie których wytwarzana była praca.';
  tooltipRelatedTo = 'Wyszukaj projekty, z którymi Twój projekt jest powiązany.';

  // ******** COMPONENT STATE ********
  hardlySavedNote = false;
  hardlyUpdatedProject = false;
  hardlySendEmails = false;

  constructor(
    @Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(LicenceService) private licenceService: LicenceService,
    @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService,
    @Inject(ProjectService) private projectService: ProjectService,
    @Inject(AttachmentService) private attachmentService: AttachmentService,
    @Inject(TagService) private tagService: TagService,
    @Inject(MatDialog) private dialog: MatDialog,
    @Inject(SearchService) private searchService: SearchService) {
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    if (this.projectUpdatingInProgress) {
          event.returnValue = 'Are you sure?';
    }
  }

  // ******** GETTERS ********
  getString(from, to) {
    return this.validation.getString(from, to);
  }

  getIsLetterOrNumberPattern() {
    return this.validation.isLetterOrNumberPattern();
  }

  getTitlePlPattern() {
    return this.validation.getTitlePattern();
  }
  // ******** FUNCTION CALLED WHEN ELEMENT'S VALUE CHANGES ********
  onTitlePlChange(event) {
    this.checkValidityTitlePl();
  }

  onTitleEnChange(event) {
    this.checkValidityTitleEn();
  }

  onDescriptionPlChange(event) {
    this.checkValidityDescriptionPl();
  }

  onDescriptionEnChange(event) {
    this.checkValidityDescriptionEn();
  }

  onProjectStatusChange(event) {
    this.checkValidityStatus();
  }

  onProjectTypeChange(event) {
    this.checkValidityType();
  }

  validateAllElements() {
    let validationOk = true;
    validationOk = this.checkValidityTitlePl() && validationOk;
    validationOk = this.checkValidityTitleEn() && validationOk;
    validationOk = this.checkValidityDescriptionPl() && validationOk;
    validationOk = this.checkValidityDescriptionEn() && validationOk;
    validationOk = this.checkValidityStatus() && validationOk;
    validationOk = this.checkValidityType() && validationOk;
    // validationOk = this.validation.validateElementAndHandleError(this.semesterChooserError, this.validateSemesterChooser()) && validationOk;
    // no tag validation - every successfully added tag had been already validated

    return validationOk;
  }

  // ******** CHECK VALIDITY ********
  checkValidityTitlePl() {
    return this.validation.validate(this.titlePlError, this.validation.validateTitlePl(this.titlePl));
  }

  checkValidityTitleEn() {
    return this.validation.validate(this.titleEnError, this.validation.validateTitleEn(this.titleEn));
  }

  checkValidityDescriptionPl() {
    return this.validation.validate(this.descriptionPlError, this.validation.validateDescriptionPl(this.descriptionPl));
  }

  checkValidityDescriptionEn() {
    return this.validation.validate(this.descriptionEnError, this.validation.validateDescriptionEn(this.descriptionEn));
  }

  checkValidityStatus() {
    return this.validation.validate(this.projectStatusError, this.validation.validateProjectStatus(this.projectStatus));
  }

  checkValidityType() {
    return this.validation.validate(this.projectTypeError, this.validation.validateProjectType(this.projectType));
  }

  checkValidityTag() {
    return this.validation.validate(this.tagsError, this.validation.validateInputTag(this.tagsListComponent));
  }

  checkValidityAttachment(attachmentType: AttachmentType, errorComponent: ErrorInfoComponent, event) {
    return this.validation.validate(errorComponent, this.validation.validateAttachment(attachmentType, event));
  }

  getParametersFromRouter() {
    let id: number;
    this.route.params.subscribe(routeParams => {
      id = routeParams.id;
      this.setInvitationError(routeParams.invitationsOk);
      this.hardlySendEmails = true;
    });
    return id;
  }

  getDataFromLocalStorage() {
    // display info about project update
    this.hardlyUpdatedProject = this.valueUtils.getBooleanAndRemoveFromSession(this.valueUtils.updatedProjectBoolean);
    console.log(this.hardlyUpdatedProject);
    if (this.hardlyUpdatedProject) {
      const updatedProjectText = this.valueUtils.getAndRemoveFromSession(this.valueUtils.updatedProjectText);
      const updatedProjectStatus = this.valueUtils.getAndRemoveFromSession(this.valueUtils.updatedProjectStatus);
      this.updateResult.setComponent(true, updatedProjectStatus, updatedProjectText);
    }
  }

  setInvitationError(invitationsOk: boolean) {
    let showError: boolean;
    // dont change line below, invitationsOk returns sth different than (invitationsOk === true)
    if (this.valueUtils.isNullOrUndefined(invitationsOk) || invitationsOk === true) {
      showError = false;
    } else {
      showError = true;
    }

    this.sendingInvitationsError.setDisplay(showError);
  }

  toggleSemesters() {
    this.semestersHidden = !this.semestersHidden;
  }

  ngOnInit() {
    this.projectUpdatingInProgress = true;
    const projectId = this.getParametersFromRouter();
    this.getDataFromLocalStorage();

    this.projectService.getProjectById(projectId).subscribe(result => {
      this.editedProject = result;
      console.log(this.editedProject);
      result.tags.forEach(tag => {
        this.tagsList.add({ id: tag.id, name: tag.name });
      });
      result.semesters.forEach(semester => {
        this.semesterChooser.chooseSemester(semester);
      });
      result.attachments.forEach(at => {
        switch (at.type) {
          case AttachmentType.THESIS: {
            this.thesisList.add({ id: at.id, name: at.fileName, visibility: at.visibility as Visibility });
            break;
          }
          case AttachmentType.SOURCE_CODE: {
            this.programsList.add({ id: at.id, name: at.fileName, visibility: at.visibility as Visibility });
            break;
          }
          case AttachmentType.PHOTO: {
            this.imagesList.add({ id: at.id, name: at.fileName, visibility: at.visibility as Visibility, selected: at.mainPhoto });
            break;
          }
          case AttachmentType.OTHER: {
            this.othersList.add({ id: at.id, name: at.fileName, visibility: at.visibility as Visibility });
            break;
          }
          case AttachmentType.MANUAL_USAGE: {
            this.instructionsList.add({ id: at.id, name: at.fileName, visibility: at.visibility as Visibility });
            break;
          }
          case AttachmentType.MANUAL_STARTUP: {
            this.instructionsStartList.add({ id: at.id, name: at.fileName, visibility: at.visibility as Visibility });
            break;
          }
        }
      });
    });
    this.projectTypeService.getTypes().subscribe(result => this.project_types = result);
    this.licenceService.getLicences().subscribe(result => this.licences = result);
    this.projectStatusService.getStatuses().subscribe(result => this.statuses = result);
    this.semestersHidden = true;
    this.tagService.getTags().subscribe(result => this.tagOptions = result);

    this.tagFilteredOptions = this.tagControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
    this.chosenSemesters = [];

    this.projectService.getPublishedProjects().subscribe(res => {
      this.projects = res.filter(x => x.id !== this.editedProject.id);
    });

    this.relatedToFilteredResults = this.relatedToControl.valueChanges
      .pipe(
        debounceTime(100),
        startWith(''),
        map(value => this.filterProject(value))
      );

    this.projectService.getRelatedProjects(projectId).subscribe(result =>
      result.forEach(pr => {
        this.relatedToList.add({ id: pr.id, name: pr.title });
    }));
  }

  filter(phrase: string): Tag[] {
    let filterValue;
    if (phrase === '') {
      return [];
    }
    if (typeof phrase === 'string') {
      filterValue = phrase.toLowerCase();
    }
    return this.tagOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  keyUpTag(event: KeyboardEvent) {
    switch (event.keyCode) {
      case ENTER:
      case SPACE:
      case COMMA: {
        if (this.checkValidityTag()) {
          const value = (<HTMLInputElement>event.target).value; // .replace(/[^a-zA-Z0-9]/g, ''); niepotrzebne, jest walidacja
          (<HTMLInputElement>event.target).value = '';
          this.addTag(value);
        }
        break;
      }
      default: {
        this.checkValidityTag();
        break;
      }
    }
  }

  tagSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.viewValue);
    this.tagControl.setValue(null);
  }

  relatedToSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.addRelatedToProject(event);
    this.relatedToControl.setValue(null);
  }

  filterProject(phrase: string): Project[] {
    let filterValue;
    if (phrase === '') {
      return [];
    }
    if (typeof phrase === 'string') {
      filterValue = phrase.toLowerCase();
    }
    return this.projects.filter(option => option.title.toLowerCase().includes(filterValue));
  }

  // Functions for itemsList (add and recive attachments and tags)
  // Add function automatically invoke recive function
  private getInputListElementFile(event): InputListElement {
    return { name: event.target.files[0].name, file: event.target.files[0] };
  }

  addThesis(event) {
    if (this.checkValidityAttachment(AttachmentType.THESIS, this.thesisError, event)) {
      this.thesisList.add(this.getInputListElementFile(event));
      this.thesisError.setDisplay(false);
    }
  }

  addProgram(event) {
    if (this.checkValidityAttachment(AttachmentType.SOURCE_CODE, this.sourceCodeError, event)) {
      this.programsList.add(this.getInputListElementFile(event));
      this.sourceCodeError.setDisplay(false);
    }
  }

  addImage(event) {
    if (this.checkValidityAttachment(AttachmentType.PHOTO, this.imageError, event)) {
      this.imagesList.add(this.getInputListElementFile(event));
      this.imageError.setDisplay(false);
    }
  }

  addInstruction(event) {
    if (this.checkValidityAttachment(AttachmentType.MANUAL_USAGE, this.manualUsageError, event)) {
      this.instructionsList.add(this.getInputListElementFile(event));
      this.manualUsageError.setDisplay(false);
    }
  }

  addInstructionStart(event) {
    if (this.checkValidityAttachment(AttachmentType.MANUAL_STARTUP, this.manualUsageStartupError, event)) {
      this.instructionsStartList.add(this.getInputListElementFile(event));
      this.manualUsageStartupError.setDisplay(false);
    }
  }

  addOther(event) {
    if (this.checkValidityAttachment(AttachmentType.OTHER, this.otherFileError, event)) {
      this.othersList.add(this.getInputListElementFile(event));
      this.otherFileError.setDisplay(false);
    }
  }

  addTag(event) {
    this.tagsList.add({ name: event });
  }

  addRelatedToProject(event) {
    this.relatedToList.add({ id: event.option.value.id, name: event.option.viewValue });
  }

  updateProject() {
    this.uploadInfoSpinner.setDisplay(false);

    if (this.validateAllElements()) {
      let status = { id: this.projectStatus.value, name: '' };
      let type = { id: this.projectType.value, name: '' };
      if (this.valueUtils.isNullOrUndefined(this.projectStatus.value)) {
        status = null;
      }
      if (this.valueUtils.isNullOrUndefined(this.projectType.value)) {
        type = null;
      }

      const updatedProject: Project = {
        id: this.editedProject.id,
        title: this.titlePl.nativeElement.value,
        description: this.descriptionPl.nativeElement.value,
        projectStatus: status,
        projectType: type,
        licence: { id: this.licence.value, name: '' },
        attachments: [], // send later
        relatedToProjects: this.getRelatedProjects(),
        tags: this.tagsList.elements.map(tag => <Tag>{ id: tag.id, name: tag.name }),
        semesters: this.semestersList.elements.map(semester => <Semester>{ id: semester.id, name: semester.name }),
        titleEng: this.titleEn.nativeElement.value,
        descriptionEng: this.descriptionEn.nativeElement.value,
        publicationDate: this.editedProject.publicationDate,
        published: this.editedProject.published
      };

      const attachmentsToSaveAmount = this.getAttachmentsToSaveAmount();

      console.log(updatedProject);
      this.updateResult.setDisplay(false);
      this.projectService.updateProject(updatedProject).subscribe(data => {
        this.projectService.setRelatedProjects(this.editedProject.id, this.getRelatedProjects()).subscribe();
        const infoString = 'Pomyślnie zaktualizowano dane projektu. ';
        console.log(updatedProject);
        if (attachmentsToSaveAmount === 0) {
          this.updateCompleted(infoString, ErrorType.SUCCESS);
        } else {
          this.uploadInfoSpinner.beginUpload(attachmentsToSaveAmount, this, infoString);
          this.uploadAllFiles();
        }
      }, error => {
        const infoString = 'Wystąpił błąd zaktualizowania danych projektu. ';
        if (attachmentsToSaveAmount === 0) {
          this.updateCompleted(infoString, ErrorType.ERROR);
        } else {
          this.uploadInfoSpinner.beginUpload(attachmentsToSaveAmount, this, infoString);
          this.uploadAllFiles();
        }
      });
    }
  }

  private getRelatedProjects(): Project[] {
    const relatedProjects: Project[] = [];
    this.relatedToList.elements.forEach(rp => {
      const project = this.projects.find(x => x.id === rp.id);
      relatedProjects.push(project);
    });
    return relatedProjects;
  }

  private uploadFiles(list, attachmentType: AttachmentType) {
    list.elements.forEach(element => {
      if (!element.id) {
        this.attachmentService.upload(element.file, attachmentType, this.editedProject.id, element.visibility,
          (attachmentType === AttachmentType.PHOTO && element.selected ? element.selected : false))
          .subscribe(data => {
            this.uploadInfoSpinner.addSuccess(element.name);
          }, error => {
            this.uploadInfoSpinner.addFail(element.name);
          });
      } else {
        this.updateMetadata(element);
      }
    });
    this.attachmentService.removeAttachments(this.editedProject, list, attachmentType);
  }

  private uploadAllFiles() {
      this.uploadFiles(this.thesisList, AttachmentType.THESIS);
      this.uploadFiles(this.programsList, AttachmentType.SOURCE_CODE);
      this.uploadFiles(this.othersList, AttachmentType.OTHER);
      this.uploadFiles(this.instructionsStartList, AttachmentType.MANUAL_STARTUP);
      this.uploadFiles(this.instructionsList, AttachmentType.MANUAL_USAGE);
      this.uploadFiles(this.imagesList, AttachmentType.PHOTO);
  }

  updateCompleted(text: string, errorType: ErrorType) {
    // this.updateResult.setComponent(true, errorType, text);
    this.uploadInfoSpinner.setDisplay(false);

    this.valueUtils.saveToSession(this.valueUtils.updatedProjectBoolean, true);
    this.valueUtils.saveToSession(this.valueUtils.updatedProjectText, text);
    this.valueUtils.saveToSession(this.valueUtils.updatedProjectStatus, errorType);
    this.projectUpdatingInProgress = false;
    window.location.reload();
  }

  saveSemesters() {
    this.toggleSemesters();
  }

  showAddedSemester(semester: Semester) {
    this.semestersList.add({ name: semester.name });
    this.chosenSemesters.push(semester);
  }

  removeAddedSemester(semester: Semester) {
    const toRemove = this.semestersList.elements.find(element => element.name === semester.name);
    this.semestersList.remove(toRemove);
    const index = this.chosenSemesters.findIndex(sem => sem.id === semester.id);
    this.chosenSemesters.splice(index, 1);
  }

  private getAttachmentsToSaveAmount() {
    return this.valueUtils.findElementsToSaveInArray(this.imagesList).length
      + this.valueUtils.findElementsToSaveInArray(this.instructionsList).length
      + this.valueUtils.findElementsToSaveInArray(this.instructionsStartList).length
      + this.valueUtils.findElementsToSaveInArray(this.othersList).length
      + this.valueUtils.findElementsToSaveInArray(this.programsList).length
      + this.valueUtils.findElementsToSaveInArray(this.thesisList).length;
  }

  private updateMetadata(th: InputListElement) {
    this.attachmentService.updateMetadata(this.editedProject.id, th.id, th.visibility ? th.visibility : Visibility.EVERYONE, th.selected ? th.selected : false)
      .subscribe(data => {
        console.log('Pomyślnie zaktualizowano załącznik ' + th.name + '. ');
      },
        error => {
          console.log('Wystąpił błąd aktualizacji załącznika ' + th.name + '. ' + error);
        });
  }

  publishCompleted(text: string, errorType: ErrorType) {
    this.uploadInfoSpinner.setDisplay(false);

    this.valueUtils.saveToSession(this.valueUtils.publishProjectBoolean, true);
    this.valueUtils.saveToSession(this.valueUtils.publishProjectText, text);
    this.valueUtils.saveToSession(this.valueUtils.publishProjectStatus, errorType);

    window.location.reload();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    let infoString;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(PublishDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.projectService.publishProject(this.editedProject.id).subscribe(data => {
          infoString = 'Pomyślnie opublikowano projekt na stronie. Status projektu: "Zakończony".';
          this.updateCompleted(infoString, ErrorType.SUCCESS);
        }, error => {
          infoString = 'Nie udało się opublikować projektu na stronie. ';
          this.updateCompleted(infoString, ErrorType.ERROR);
        });
        window.location.reload();
      }
    });

  }
}
