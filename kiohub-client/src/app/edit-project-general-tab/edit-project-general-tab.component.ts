import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import { FormControl } from '../../../node_modules/@angular/forms';
import { Observable } from '../../../node_modules/rxjs';
import { startWith, map } from '../../../node_modules/rxjs/operators';
import { MatAutocompleteSelectedEvent } from '../../../node_modules/@angular/material';

export interface Status {
  value: number;
  viewValue: string;
}

export interface Type {
  value: number;
  viewValue: string;
}

export interface Licence {
  value: number;
  viewValue: string;
}

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
  statuses: Status[] = [
    {value: 0, viewValue: 'W trakcie'},
    {value: 1, viewValue: 'Zakończony'},
    {value: 2, viewValue: 'Problematyczny'},
    {value: 3, viewValue: 'Skasowany'}
  ];

  project_types: Type[] = [
    {value: 0, viewValue: 'Praca inżynierska'},
    {value: 1, viewValue: 'Praca magisterska'},
    {value: 2, viewValue: 'Projekt grupowy'},
  ];

  licences: Licence[] = [
    {value: 0, viewValue: 'Licencja 1'},
    {value: 1, viewValue: 'Licencja 2'},
    {value: 2, viewValue: 'Licencja 3'},
  ];

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
  semestersHidden = false;
  constructor() { }

  ngOnInit() {
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
        const value = (<HTMLInputElement>event.target).value;
        (<HTMLInputElement>event.target).value = '';
        this.addTag(value);
        break;
      }
    }
  }

  tagSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.viewValue);
    this.tagControl.setValue(null);
    // It doesn't work
    this.tagControl.disable();
    this.tagControl.enable();
    this.tagControl.markAsUntouched();
    console.log(document.getElementsByName('tags')[0]);
    document.getElementsByName('tags')[0].classList.remove('mat-focused');
    console.log(document.getElementsByName('tags')[0]);
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

toggleSemesters() {
  this.semestersHidden = !this.semestersHidden;
}
}
