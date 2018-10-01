import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sort-results',
  templateUrl: './sort-results.component.html',
  styleUrls: ['./sort-results.component.css']
})
export class SortResultsComponent implements OnInit {
  selectedSorting: string;
  sortTypes: string[];
  constructor() { }

  ngOnInit() {
  }

  applySorting() {

  }
}
