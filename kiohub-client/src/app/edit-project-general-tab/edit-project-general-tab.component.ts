import { Component, OnInit } from '@angular/core';

export interface Status {
  value: number;
  viewValue: string;
}

export interface Type {
  value: number;
  viewValue: string;
}

export interface Licence {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-edit-project-general-tab',
  templateUrl: './edit-project-general-tab.component.html',
  styleUrls: ['./edit-project-general-tab.component.css']
})

export class EditProjectGeneralTabComponent implements OnInit {
  statuses: Status[] = [
    {value: 0, viewValue: 'W trakcie'},
    {value: 1, viewValue: 'Zakończony'},
    {value: 2, viewValue: 'Problematyczny'},
    {value: 3, viewValue: 'Skasowany'}
  ];

  project_types: Type[] = [
    {value: 0, viewValue: 'Praca inżynierska'},
    {value: 1, viewValue: 'Praca magisterska'},
    {value: 2, viewValue: 'Projekt grupowy'},
  ];

  licences: Licence[] = [
    {value: 0, viewValue: 'Licencja 1'},
    {value: 1, viewValue: 'Licencja 2'},
    {value: 2, viewValue: 'Licencja 3'},
  ];

  constructor() { }

  ngOnInit() {
  }

  onFileChange(event) {
    const files = event.target.files[0].name;
    alert(files);
  }

}
