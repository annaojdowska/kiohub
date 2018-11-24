import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Visibility } from '../model/visibility.enum';
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


  constructor() {  }

  ngOnInit() {
    this.selected = this.selected ? this.selected : Visibility.EVERYONE;
    }

  selectChange(value: Visibility) {
    this.selectionChange.emit(value);
  }

}
