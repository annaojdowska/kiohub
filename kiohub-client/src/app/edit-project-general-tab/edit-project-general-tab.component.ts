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
  tagFilteredOptions: Observable<InputListElement[]>;

  semestersHidden: boolean;

  constructor(@Inject(ProjectTypeService) private projectTypeService: ProjectTypeService,
              @Inject(LicenceService) private licenceService: LicenceService,
              @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService,
              @Inject(ProjectService) private projectService: ProjectService) { }

  toggleSemesters() {
    this.semestersHidden = !this.semestersHidden;
  }

  ngOnInit() {
    this.projectService.getProjectById(1).subscribe(result => {
      this.editedProject = result;
      result.tags.forEach(tag => {
        this.tagsList.add({ name: tag.name});
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


}
