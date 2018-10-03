import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InputListElement } from '../model/input-list-element';
import { Visibility } from '../model/visibility.enum';
import { utils } from '../../../node_modules/protractor';
import { ValueUtils } from '../error-info/value-utils';

@Component({
  selector: 'app-visibility-select',
  templateUrl: './visibility-select.component.html',
  styleUrls: ['./visibility-select.component.css']
})
export class VisibilitySelectComponent implements OnInit {
  selected: Visibility;
  @Output() selectionChange = new EventEmitter<Visibility>();
  valueUtils = new ValueUtils();
  @Input() allowEveryone = true;
  @Input() allowLoggedUsers = true;
  @Input() allowCollaborators = true;
  @Input() allowPrivate = true;


  constructor() {

  }

  ngOnInit() {
     if (!this.selected) {
      this.selected = Visibility.LOGGED_USERS;
     }
    this.selectionChange.emit(this.selected);
  }

  selectChange(value: Visibility) {
    this.selectionChange.emit(this.selected);
  }

}
