import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '../../../node_modules/@angular/animations';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({height: '0px'}),
      animate('500ms linear', style({height: '*'}))
      ]),
      transition(':leave', [
      animate('500ms linear', style({height: '0px'}))
      ])
    ])
  ]
})
export class MyProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
