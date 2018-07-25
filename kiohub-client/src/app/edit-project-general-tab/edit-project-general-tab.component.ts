import { Component, OnInit } from '@angular/core';

export interface Status {
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
  constructor() { }

  ngOnInit() {
  }

}
