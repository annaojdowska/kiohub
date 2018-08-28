import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
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

export interface Attachments {
  thesis: InputListElement[];
  programs: InputListElement[];
  images: InputListElement[];
  instructions: InputListElement[];
  instructionsStart: InputListElement[];
  others: InputListElement[];
}

export interface Tags {
  tag: InputListElement[];
}

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
  @ViewChild('title') title: any;
  @ViewChild('description') description: any;
  @ViewChild('projectStatus') projectStatus: any;
  @ViewChild('projectType') projectType: any;
  @ViewChild('licence') licence: any;
  attachments: Attachments = {
    thesis: [],
    programs: [],
    images: [],
    instructions: [],
    instructionsStart: [],
    others: [],
  };

  tags: Tags = {
    tag: [],
  };

  tagsToSent: string[] = [];
  tagControl = new FormControl();
  tagOptions: string[] = ['aplikacja', 'sztucznainteligencja', 'java'];
  tagFilteredOptions: Observable<InputListElement[]>;

  semestersHidden: boolean;

  constructor(@Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
              @Inject(LicenceService) private licenceService: LicenceService,
              @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService,
              @Inject(ProjectService) private projectService: ProjectService,
              @Inject(AttachmentService) private attachmentService: AttachmentService,
              @Inject(TagService) private tagService: TagService) { }

  toggleSemesters() {
    this.semestersHidden = !this.semestersHidden;
  }

  ngOnInit() {
    this.projectService.getProjectById(41).subscribe(result => {
      this.editedProject = result;
      console.log(this.editedProject);
      result.tags.forEach(tag => {
        this.tagsList.add({ name: tag.name });
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
    this.tagFilteredOptions = this.tagControl.valueChanges.pipe(
      startWith(null),
      map((value: InputListElement | null) => value ? this._filter(value) : this.tagOptions.map(t => <InputListElement>{ name: t})));
    }

  // Functions for tag input

  keyUpTag(event: KeyboardEvent) {
    switch (event.keyCode) {
      case ENTER:
      case SPACE:
      case COMMA: {
        const value = (<HTMLInputElement>event.target).value.replace(/[^a-zA-Z0-9]/g, '');
        (<HTMLInputElement>event.target).value = '';
        this.addTag(value);
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
    return this.tagOptions.filter(option => option.toLowerCase().includes(filterValue)).map(o => <InputListElement>{ name: o});
  }

  // Functions for itemsList (add and recive attachments and tags)
  // Add function automatically invoke recive function

  private getInputListElementFile(event): InputListElement {
    return { name: event.target.files[0].name, file: event.target.files[0]};
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
    this.tagsList.add({name: event});
  }

  recieveThesis(elements: InputListElement[]) {
    this.attachments.thesis = [];
    elements.map(e => this.attachments.thesis.push(e));
  }

  recievePrograms(elements: InputListElement[]) {
    this.attachments.programs = [];
    elements.map(e => this.attachments.programs.push(e));
  }

  recieveImages(elements: InputListElement[]) {
    this.attachments.images = [];
    elements.map(e => this.attachments.images.push(e));
 }

 recieveInstructions(elements: InputListElement[]) {
  this.attachments.instructions = [];
  elements.map(e => this.attachments.instructions.push(e));
}

recieveInstructionsStart(elements: InputListElement[]) {
  this.attachments.instructionsStart = [];
  elements.map(e => this.attachments.instructionsStart.push(e));
}

recieveOthers(elements: InputListElement[]) {
  this.attachments.others = [];
  elements.map(e => this.attachments.others.push(e));
}

recieveTags(elements: InputListElement[]) {
  this.tags.tag = [];
  elements.map(e => this.tags.tag.push(e));
}

  updateProject() {
    const updatedProject: Project = {
      id: this.editedProject.id,
      title: this.title.nativeElement.value,
      description: this.description.nativeElement.value,
      projectStatus: { id: this.projectStatus.value, name: '' },
      projectType: { id: this.projectType.value, name: '' },
      licence: { id: this.licence.value, name: '' },
      attachments: [], // send later
      relatedToProjects: [], // not used so far
      relatedFromProjects: [], // not used so far
      projectSettings: null, // not used so far
      tags: null, // send later
      semesters: [], // to do
      titleEng: null, // not used so far
      descriptionEng: null, // not used so far
      publicationDate: this.editedProject.publicationDate,
      published: this.editedProject.published
    };
    console.log(updatedProject);
    this.projectService.updateProject(updatedProject);
    // this.tagsList._elements.forEach(tag => this.tagsToSent.push(tag.name)); // ???
    // this.tagService.addTags(updatedProject.id, this.tagsToSent).subscribe(data => {
    //   alert('ok');
    // },
    // error => {
    //   alert('nie ok');
    // });

    /*
    this.attachments.thesis.forEach(th => {
      this.attachmentService.upload(th.file, AttachmentType.THESIS, 1, Visibility.EVERYONE, false).subscribe(data => {
        alert('ok');
      },
      error => {
        alert('nie ok');
      });
    });

    this.attachments.programs.forEach(th => {
      this.attachmentService.upload(th.file, AttachmentType.SOURCE_CODE, 1, Visibility.EVERYONE, false).subscribe(data => {
        alert('ok');
      },
      error => {
        alert('nie ok');
      });
    });

    this.attachments.others.forEach(th => {
      this.attachmentService.upload(th.file, AttachmentType.OTHER, 1, Visibility.EVERYONE, false).subscribe(data => {
        alert('ok');
      },
      error => {
        alert('nie ok');
      });
    });

    this.attachments.instructionsStart.forEach(th => {
      this.attachmentService.upload(th.file, AttachmentType.MANUAL_STARTUP, 1, Visibility.EVERYONE, false).subscribe(data => {
        alert('ok');
      },
      error => {
        alert('nie ok');
      });
    });

    this.attachments.instructions.forEach(th => {
      this.attachmentService.upload(th.file, AttachmentType.MANUAL_USAGE, 1, Visibility.EVERYONE, false).subscribe(data => {
        alert('ok');
      },
      error => {
        alert('nie ok');
      });
    });

    this.attachments.images.forEach(th => {
      this.attachmentService.upload(th.file, AttachmentType.PHOTO, 1, Visibility.EVERYONE, false).subscribe(data => {
        alert('ok');
      },
      error => {
        alert('nie ok');
      });
    });
    */
  }
}
