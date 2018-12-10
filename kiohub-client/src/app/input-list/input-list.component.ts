import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { InputListElement } from '../model/input-list-element';
import { Visibility } from '../model/visibility.enum';

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
  @Input() allowLoggedUsers = true;

  focusedStyle = '';
  elements: InputListElement[] = [];
  visible = true;
  addOnBlur = false;

  tooltipDelete = 'Usuń element.';
  tooltipVisibility = 'Zmień widoczność elementu.';
  tooltipChooseMainPhoto = 'Wybierz zdjęcie jako zdjęcie główne projektu.';
  tooltipMainPhotoSelected = 'Te zdjęcie jest zdjęciem głównym projektu.';

  constructor() { }

  ngOnInit(): void {
  }

  add(element: InputListElement): void {
    if (element.name !== '') {
      if (this.selectable) {
        if (element.selected) {
          this.select(element);
        } else {
          if (!this.elements.some(e => e.selected as boolean)) {
            element.selected = true;
          }
        }
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
      if (this.elements.length > 0 && !this.elements.some(e => e.selected as boolean)) {
        this.elements[0].selected = true;
      }
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
