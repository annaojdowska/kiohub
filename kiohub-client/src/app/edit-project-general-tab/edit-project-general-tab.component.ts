import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
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

export interface Attachment {
  name: string;
}

export interface Attachments {
  thesis: Attachment[];
  programs: Attachment[];
  images: Attachment[];
  instructions: Attachment[];
  instructionsStart: Attachment[];
  others: Attachment[];
}

export interface Tag {
  name: string;
}

export interface Tags {
  tag: Tag[];
}

@Component({
  selector: 'app-edit-project-general-tab',
  templateUrl: './edit-project-general-tab.component.html',
  styleUrls: ['./edit-project-general-tab.component.css']
})

export class EditProjectGeneralTabComponent implements OnInit {
  statuses: Status[];
  licences: Licence[];
  project_types: ProjectType[];

  @ViewChild('thesisList') thesisList: any;
  @ViewChild('programsList') programsList: any;
  @ViewChild('imagesList') imagesList: any;
  @ViewChild('instructionsList') instructionsList: any;
  @ViewChild('instructionsStartList') instructionsStartList: any;
  @ViewChild('othersList') othersList: any;
  @ViewChild('tagsList') tagsList: any;

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

  tagControl = new FormControl();
  tagOptions: string[] = ['aplikacja', 'sztucznainteligencja', 'java'];
  tagFilteredOptions: Observable<string[]>;

  semestersHidden: boolean;

  constructor(@Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
              @Inject(LicenceService) private licenceService: LicenceService,
              @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService) { }

  toggleSemesters() {
    this.semestersHidden = !this.semestersHidden;
  }

  ngOnInit() {
    this.projectTypeService.getTypes().subscribe(result => this.project_types = result);
    this.licenceService.getLicences().subscribe(result => this.licences = result);
    this.projectStatusService.getStatuses().subscribe(result => this.statuses = result);
    this.semestersHidden = true;
    this.tagFilteredOptions = this.tagControl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => value ? this._filter(value) : this.tagOptions));
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tagOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  // Functions for itemsList (add and recive attachments and tags)

  addThesis(event) {
    const filename = event.target.files[0].name;
    this.thesisList.add(filename);
  }

  addProgram(event) {
    const filename = event.target.files[0].name;
    this.programsList.add(filename);
  }

  addImage(event) {
    const filename = event.target.files[0].name;
    this.imagesList.add(filename);
  }

  addInstruction(event) {
    const filename = event.target.files[0].name;
    this.instructionsList.add(filename);
  }

  addInstructionStart(event) {
    const filename = event.target.files[0].name;
    this.instructionsStartList.add(filename);
  }

  addOther(event) {
    const filename = event.target.files[0].name;
    this.othersList.add(filename);
  }

  addTag(event) {
    this.tagsList.add(event);
  }

  recieveThesis(event) {
    this.attachments.thesis = [];
    event.map(name => this.attachments.thesis.push({name: name}));
  }

  recievePrograms(event) {
    this.attachments.programs = [];
    event.map(name => this.attachments.programs.push({name: name}));
  }

  recieveImages(event) {
    this.attachments.images = [];
    event.map(name => this.attachments.images.push({name: name}));
 }

 recieveInstructions(event) {
  this.attachments.instructions = [];
  event.map(name => this.attachments.instructions.push({name: name}));
}

recieveInstructionsStart(event) {
  this.attachments.instructionsStart = [];
  event.map(name => this.attachments.instructionsStart.push({name: name}));
}

recieveOthers(event) {
  this.attachments.others = [];
  event.map(name => this.attachments.others.push({name: name}));
}

recieveTags(event) {
  this.tags.tag = [];
  event.map(name => this.tags.tag.push({name: name}));
}


}
