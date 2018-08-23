import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  @Input() hideInput = false;
  @Input() orientation = 'horizontal';
  @Input() elements: string = null;
  @Input() predefiniedElements = 'Apple, Lemon, Lime, Orange, Strawberry';
  @Input() placeholder = 'Kolejne adresy e-mail rozdziel przecinkami, spacjami lub wciśnij enter';
  focusedStyle = '';
  _removable: boolean;
  _hideInput: boolean;
  _orientation: string;
  filteredElements: Observable<string[]>;
  _elements: string[];
  _predefiniedElements: string[];
  _placeholder;
  @Output() changeElements = new EventEmitter<string[]>();
  visible = true;
  selectable = false;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  elementCtrl = new FormControl();


  @ViewChild('elementInput') fruitInput: ElementRef;

  constructor() {

    this.filteredElements = this.elementCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this._predefiniedElements.slice()));
  }

  sendElements() {
    console.log('Cos sie dzieje');
    this.changeElements.emit(this._elements);
  }


  ngOnInit(): void {
    this._removable = this.removable;
    this._hideInput = this.hideInput;
    this._orientation = this.orientation;
    if (this.elements === '' || this.elements == null) {
      this._elements = [];
    } else {
      this._elements = this.elements.split(',');
    }
    this._predefiniedElements = this.predefiniedElements.split(',').map(element => element.trim());
    this._placeholder = this.placeholder;
    console.log(this.hideInput);
    this.sendElements();
  }

  addMatChip(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our element
    if ((value || '').trim()) {
      this._elements.push(value.trim());
      this.sendElements();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.elementCtrl.setValue(null);
  }

  add(element: string): void {
    // console.log(element);
    // if ((element || '').trim()) {
    //   this._elements.push(element.trim());
    //   this.sendElements();
    // }

      this._elements.push(element);
      this.sendElements();
  }

  inputFocus(): void {
    this.focusedStyle = 'mat-focused';
    }

  inputFocusOut(): void {
    this.focusedStyle = '';
    }

  remove(fruit: string): void {
    const index = this._elements.indexOf(fruit);

    if (index >= 0) {
      this._elements.splice(index, 1);
      this.sendElements();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this._elements.push(event.option.viewValue);
    this.sendElements();
    this.fruitInput.nativeElement.value = '';
    this.elementCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._predefiniedElements.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
}
