import { Component, OnInit } from '@angular/core';

export interface Licence {
  value: number;
  viewValue: string;
}

export interface Type {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-advanced-search-form',
  templateUrl: './advanced-search-form.component.html',
  styleUrls: ['./advanced-search-form.component.css'],
})

export class AdvancedSearchFormComponent implements OnInit {
  licences: Licence[] = [
    {value: 0, viewValue: 'Licencja 1'},
    {value: 1, viewValue: 'Licencja 2'},
    {value: 2, viewValue: 'Licencja 3'},
  ];

  project_types: Type[] = [
    {value: 0, viewValue: 'Praca inżynierska'},
    {value: 1, viewValue: 'Praca magisterska'},
    {value: 2, viewValue: 'Projekt grupowy'},
  ];
  semestersHidden: boolean;
  constructor() { }

  ngOnInit() {
    this.semestersHidden = false;
  }

  toggleSemesters() {
    this.semestersHidden = !this.semestersHidden;
  }

}
