import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InputListElement } from '../model/input-list-element';
import { Visibility } from '../model/visibility.enum';
import { utils } from '../../../node_modules/protractor';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-visibility-select',
  templateUrl: './visibility-select.component.html',
  styleUrls: ['./visibility-select.component.css']
})
export class VisibilitySelectComponent implements OnInit {
  @Input() selected: Visibility;
  @Output() selectionChange = new EventEmitter<Visibility>();
  valueUtils = new ValueUtils();
  @Input() allowEveryone = true;
  @Input() allowLoggedUsers = true;
  @Input() allowCollaborators = true;
  @Input() allowPrivate = true;


  constructor() {

  }

  ngOnInit() {

    }

  selectChange(value: Visibility) {
    this.selectionChange.emit(value);
  }

}
