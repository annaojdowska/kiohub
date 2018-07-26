import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-project-management-tab',
  templateUrl: './edit-project-management-tab.component.html',
  styleUrls: ['./edit-project-management-tab.component.css']
})
export class EditProjectManagementTabComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  deleteProject() {
    alert('Usunięto projekt :(');
  }

}
