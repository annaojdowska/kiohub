import {Component, ElementRef, ViewChild, Input, OnInit} from '@angular/core';
import { InputListElement } from '../model/input-list-element';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-input-list',
  templateUrl: 'input-list.component.html',
  styleUrls: ['input-list.component.css'],
})
export class InputListComponent implements OnInit {
  @Input() removable = false;
  @Input() orientation = 'horizontal';
  @Input() placeholder = 'Kolejne adresy e-mail rozdziel przecinkami, spacjami lub wciśnij enter';
  focusedStyle = '';
  elements: InputListElement[] = [];
  visible = true;
  selectable = false;
  addOnBlur = false;

  constructor() {}

  ngOnInit(): void {
  }

  add(element: InputListElement): void {
    // console.log(element);
    // if ((element || '').trim()) {
    //   this._elements.push(element.trim());
    //   this.sendElements();
    // }

      this.elements.push(element);
  }

  remove(element: InputListElement): void {
    const index = this.elements.indexOf(element);

    if (index >= 0) {
      this.elements.splice(index, 1);
    }
  }

}
