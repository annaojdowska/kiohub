import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
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

@Component({
  selector: 'app-edit-project-general-tab',
  templateUrl: './edit-project-general-tab.component.html',
  styleUrls: ['./edit-project-general-tab.component.css']
})

export class EditProjectGeneralTabComponent implements OnInit {
  editedProject: Project;
  statuses: Status[];
  licences: Licence[];
  project_types: ProjectType[];
  @ViewChild('thesisList') thesisList: InputListComponent;
  @ViewChild('programsList') programsList: InputListComponent;
  @ViewChild('imagesList') imagesList: InputListComponent;
  @ViewChild('instructionsList') instructionsList: InputListComponent;
  @ViewChild('instructionsStartList') instructionsStartList: InputListComponent;
  @ViewChild('othersList') othersList: InputListComponent;
  @ViewChild('tagsList') tagsList: InputListComponent;
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
  @ViewChild('titlePlError') titlePlError: ErrorInfoComponent;
  @ViewChild('titleEnError') titleEnError: ErrorInfoComponent;
  @ViewChild('descriptionPlError') descriptionPlError: ErrorInfoComponent;
  @ViewChild('descriptionEnError') descriptionEnError: ErrorInfoComponent;
  @ViewChild('projectTypeError') projectTypeError: ErrorInfoComponent;
  @ViewChild('projectStatusError') projectStatusError: ErrorInfoComponent;
  @ViewChild('semesterChooserError') semesterChooserError: ErrorInfoComponent;
  @ViewChild('tagsError') tagsError: ErrorInfoComponent;

  readonly MAX_SIZE_DESCRIPTION_PL = 2000;
  readonly MAX_SIZE_DESCRIPTION_EN = 2000;
  readonly MAX_SIZE_TAG = 30;

  tagsToSent: string[] = [];
  tagControl = new FormControl();
  tagOptions: Tag[] = [];
  tagFilteredOptions: Observable<Tag[]>;
  chosenSemesters: Semester[];
  semestersHidden: boolean;
  nr = 0;
  validation: Validation = new Validation();

  getString(from, to) {
    return this.validation.getString(from, to);
  }

  getIsLetterOrNumberPattern() {
    return this.validation.isLetterOrNumberPattern();
  }

  constructor(@Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(LicenceService) private licenceService: LicenceService,
    @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService,
    @Inject(ProjectService) private projectService: ProjectService,
    @Inject(AttachmentService) private attachmentService: AttachmentService,
    @Inject(TagService) private tagService: TagService) { }

  // ******** functions called when element's state changes
  onTitlePlChange(event) {
    this.validation.validateElementAndHandleError(this.titlePlError, this.validateTitlePl());
  }

  onTitleEnChange(event) {
    this.validation.validateElementAndHandleError(this.titleEnError, this.validateTitleEn());
  }

  onDescriptionPlChange(event) {
    this.validation.validateElementAndHandleError(this.descriptionPlError, this.validateDescriptionPl());
  }

  onDescriptionEnChange(event) {
    this.validation.validateElementAndHandleError(this.descriptionEnError, this.validateDescriptionEn());
  }

  // ******** validations
  validateAllElements() {
    let validationOk = true;
    validationOk = this.validation.validateElementAndHandleError(this.titlePlError, this.validateTitlePl()) && validationOk;
    validationOk = this.validation.validateElementAndHandleError(this.titleEnError, this.validateTitleEn()) && validationOk;
    validationOk = this.validation.validateElementAndHandleError(this.descriptionPlError, this.validateDescriptionPl()) && validationOk;
    validationOk = this.validation.validateElementAndHandleError(this.descriptionEnError, this.validateDescriptionEn()) && validationOk;
    // validationOk = this.validationPatterns.validateElementAndHandleError(this.projectTypeError, this.validateProjectType()) && validationOk;
    // validationOk = this.validationPatterns.validateElementAndHandleError(this.projectStatusError, this.validateProjectStatus()) && validationOk;
    // validationOk = this.validation.validateElementAndHandleError(this.semesterChooserError, this.validateSemesterChooser()) && validationOk;
    // no tag validation - every successfully added tag had been already validated

    return validationOk;
  }

  validateTitlePl() {
    return this.validation.validateMandatoryInputWithPattern(this.titlePl);
  }

  validateTitleEn() {
    return this.validation.validateInputWithPattern(this.titleEn);
  }

  validateDescriptionPl() {
    return this.validation.validateTextArea(this.descriptionPl, this.MAX_SIZE_DESCRIPTION_PL);
  }

  validateDescriptionEn() {
    return this.validation.validateTextArea(this.descriptionEn, this.MAX_SIZE_DESCRIPTION_EN);
  }

  validateProjectType() {
    return this.validation.validateSelectNotNull(this.projectType);
  }

  validateProjectStatus() {
    return this.validation.validateSelectNotNull(this.projectStatus);
  }

  validateSemesterChooser() {
    return this.validation.validateSemesterChooser(this.semesterChooser);
  }

  validateInputTag() {
    return this.validation.validateInputWithPattern(this.tagsListComponent) && this.validation.validateMaxSize(this.tagsListComponent.nativeElement.value, this.MAX_SIZE_TAG);
  }

  // other
  getProjectIdFromRouter() {
    let id: number;
    this.route.params.subscribe(routeParams => {
      id = routeParams.id;
    });
    return id;
  }

  toggleSemesters() {
    this.semestersHidden = !this.semestersHidden;
  }

  ngOnInit() {
    const projectId = this.getProjectIdFromRouter();
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
            this.thesisList.add({ id: at.id, name: at.fileName });
            break;
          }
          case AttachmentType.SOURCE_CODE: {
            this.programsList.add({ id: at.id, name: at.fileName });
            break;
          }
          case AttachmentType.PHOTO: {
            this.imagesList.add({ id: at.id, name: at.fileName });
            break;
          }
          case AttachmentType.OTHER: {
            this.othersList.add({ id: at.id, name: at.fileName });
            break;
          }
          case AttachmentType.MANUAL_USAGE: {
            this.instructionsList.add({ id: at.id, name: at.fileName });
            break;
          }
          case AttachmentType.MANUAL_STARTUP: {
            this.instructionsStartList.add({ id: at.id, name: at.fileName });
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
  }

  filter(phrase: string): Tag[] {
    if (phrase === '') {
      return [];
    }
    // console.log(phrase);
    if (typeof phrase === 'string') {
      const filterValue = phrase.toLowerCase();
    }
    return this.tagOptions.filter(option => option.name.toLowerCase().includes(phrase));
  }

  // Functions for tag input

  keyUpTag(event: KeyboardEvent) {
    switch (event.keyCode) {
      case ENTER:
      case SPACE:
      case COMMA: {
        if (this.validation.validateElementAndHandleError(this.tagsError, this.validateInputTag())) {
          const value = (<HTMLInputElement>event.target).value; // .replace(/[^a-zA-Z0-9]/g, ''); niepotrzebne, jest walidacja
          (<HTMLInputElement>event.target).value = '';
          this.addTag(value);
        }
        break;
      }
      default: {
        this.validation.validateElementAndHandleError(this.tagsError, this.validateInputTag());
        break;
      }
    }
  }


  tagSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.viewValue);
    this.tagControl.setValue(null);
  }

  private _filter(value: InputListElement): InputListElement[] {
    const filterValue = value.name.toLowerCase();
    return this.tagOptions.filter(option => option.name.toLowerCase().includes(filterValue)).map(o => <InputListElement>{ name: o.name });
  }

  // Functions for itemsList (add and recive attachments and tags)
  // Add function automatically invoke recive function

  private getInputListElementFile(event): InputListElement {
    return { name: event.target.files[0].name, file: event.target.files[0] };
  }

  addThesis(event) {
    this.thesisList.add(this.getInputListElementFile(event));
  }

  addProgram(event) {
    this.programsList.add(this.getInputListElementFile(event));
  }

  addImage(event) {
    this.imagesList.add(this.getInputListElementFile(event));
  }

  addInstruction(event) {
    this.instructionsList.add(this.getInputListElementFile(event));
  }

  addInstructionStart(event) {
    this.instructionsStartList.add(this.getInputListElementFile(event));
  }

  addOther(event) {
    this.othersList.add(this.getInputListElementFile(event));
  }

  addTag(event) {
    this.tagsList.add({ name: event });
  }

  updateProject() {

    if (this.validateAllElements()) {
      let status =  { id: this.projectStatus.value, name: '' };
      let type = { id: this.projectType.value, name: '' };
      if (this.validation.isNullOrUndefined(this.projectStatus.value)) {
        status = null;
      }
      if (this.validation.isNullOrUndefined(this.projectType.value)) {
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
        relatedToProjects: [], // not used so far
        relatedFromProjects: [], // not used so far
        projectSettings: null, // not used so far
        tags: this.tagsList.elements.map(tag => <Tag>{ id: tag.id, name: tag.name }),
        semesters: this.semestersList.elements.map(semester => <Semester>{ id: semester.id, name: semester.name }),
        titleEng: this.titleEn.nativeElement.value,
        descriptionEng: this.descriptionEn.nativeElement.value,
        publicationDate: this.editedProject.publicationDate,
        published: this.editedProject.published
      };

      console.log(updatedProject);
    //  if (updatedProject.projectStatus.id && updatedProject.projectType.id) {
        this.projectService.updateProject(updatedProject).subscribe(data => {
          console.log('ERROR: Projekt zapisano pomyślnie.');
        },
          error => {
            console.log('ERROR: Wystąpił błąd wysłania projektu.');
          });
   //   }
      // else if (!updatedProject.projectStatus.id && !updatedProject.projectType.id) {
      //   console.log('ERROR: Podaj status i typ projektu.');
      // } else if (!updatedProject.projectStatus.id) {
      //   console.log('ERROR: Podaj status projektu.');
      // } else if (!updatedProject.projectType.id) {
      //   console.log('ERROR: Podaj typ projektu');
      // }
      // else {
      //   console.log('ERROR: Wystąpił błąd walidacji.');
      // }

      this.thesisList.elements.forEach(th => {
        if (!th.id) {
          this.attachmentService.upload(th.file, AttachmentType.THESIS, this.editedProject.id, Visibility.EVERYONE, false)
            .subscribe(data => { },
              error => {
                console.log('ERROR: Wystąpił błąd wysłania załącznika ' + th.name + '. ' + error);
              });
        }
      });
      this.attachmentService.removeAttachments(this.editedProject, this.thesisList, AttachmentType.THESIS);

      this.programsList.elements.forEach(th => {
        if (!th.id) {
          this.attachmentService.upload(th.file, AttachmentType.SOURCE_CODE, this.editedProject.id, Visibility.EVERYONE, false)
            .subscribe(data => { },
              error => {
                console.log('ERROR: Wystąpił błąd wysłania załącznika ' + th.name + '. ' + error);
              });
        }
      });
      this.attachmentService.removeAttachments(this.editedProject, this.programsList, AttachmentType.SOURCE_CODE);

      this.othersList.elements.forEach(th => {
        if (!th.id) {
          this.attachmentService.upload(th.file, AttachmentType.OTHER, this.editedProject.id, Visibility.EVERYONE, false)
            .subscribe(data => { },
              error => {
                console.log('ERROR: Wystąpił błąd wysłania załącznika ' + th.name + '. ' + error);
              });
        }
      });
      this.attachmentService.removeAttachments(this.editedProject, this.othersList, AttachmentType.OTHER);

      this.instructionsStartList.elements.forEach(th => {
        if (!th.id) {
          this.attachmentService.upload(th.file, AttachmentType.MANUAL_STARTUP, this.editedProject.id, Visibility.EVERYONE, false)
            .subscribe(data => { },
              error => {
                console.log('ERROR: Wystąpił błąd wysłania załącznika ' + th.name + '. ' + error);
              });
        }
      });
      this.attachmentService.removeAttachments(this.editedProject, this.instructionsStartList, AttachmentType.MANUAL_STARTUP);

      this.instructionsList.elements.forEach(th => {
        if (!th.id) {
          this.attachmentService.upload(th.file, AttachmentType.MANUAL_USAGE, this.editedProject.id, Visibility.EVERYONE, false)
            .subscribe(data => { },
              error => {
                console.log('ERROR: Wystąpił błąd wysłania załącznika ' + th.name + '. ' + error);
              });
        }
      });
      this.attachmentService.removeAttachments(this.editedProject, this.instructionsList, AttachmentType.MANUAL_USAGE);

      this.imagesList.elements.forEach(th => {
        if (!th.id) {
          this.attachmentService.upload(th.file, AttachmentType.PHOTO, this.editedProject.id, Visibility.EVERYONE,
            th.selected ? th.selected : false)
            .subscribe(data => { },
              error => {
                console.log('ERROR: Wystąpił błąd wysłania załącznika ' + th.name + '. ' + error);
              });
        }
      });
      this.attachmentService.removeAttachments(this.editedProject, this.imagesList, AttachmentType.PHOTO);

    }
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
}
