import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-sort-results',
  templateUrl: './sort-results.component.html',
  styleUrls: ['./sort-results.component.css']
})
export class SortResultsComponent implements OnInit {
  @Input() sortingRules: string[];
  @Output() ruleSelectionChanged = new EventEmitter<string>();
  selectedRule: string;
  constructor() { }

  ngOnInit() {
  }

  applySorting(change: MatSelectChange) {
    this.ruleSelectionChanged.emit(change.value);
  }
}
