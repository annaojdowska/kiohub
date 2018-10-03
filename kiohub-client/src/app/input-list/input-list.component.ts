import {Component, ElementRef, ViewChild, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { InputListElement } from '../model/input-list-element';
import { VisibilitySelectComponent } from '../visibility-select/visibility-select.component';
import { Visibility } from '../model/visibility.enum';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-input-list',
  templateUrl: 'input-list.component.html',
  styleUrls: ['input-list.component.css'],
})
export class InputListComponent implements OnInit {
  @Input() visibilityChangeable = false;
  @Input() removable = false;
  @Input() orientation = 'horizontal';
  @Input() placeholder = 'Kolejne adresy e-mail rozdziel przecinkami, spacjami lub wciśnij enter';
  @Input() selectable = false;
  @Output() elementRemoved = new EventEmitter<InputListElement>();

  focusedStyle = '';
  elements: InputListElement[] = [];
  visible = true;
  addOnBlur = false;

  constructor() {}

  ngOnInit(): void {
  }

  add(element: InputListElement): void {
    if (element.name !== '') {
      if (element.selected) {
        this.select(element);
      } else {
        element.selected = false;
      }
      if (!element.visibility) {
        element.visibility = Visibility.EVERYONE;
      }
      this.elements.push(element);
    }
  }

  remove(element: InputListElement): void {
    const index = this.elements.indexOf(element);

    if (index >= 0) {
      this.elements.splice(index, 1);
      this.elementRemoved.emit(element);
    }
  }

  select(element: InputListElement): void {
    if (this.selectable) {
      const index = this.elements.indexOf(element);
      this.elements.forEach(e => e.selected = (index === this.elements.indexOf(e)));
    }
  }

  selectionChange(element: InputListElement, visibility: Visibility) {
    const index = this.elements.indexOf(element);
    this.elements[index].visibility = visibility;
  }

}
