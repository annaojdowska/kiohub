import { Component, OnInit, Inject } from '@angular/core';
import { trigger, transition, animate, style } from '../../../node_modules/@angular/animations';
import { Router } from '../../../node_modules/@angular/router';

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

  constructor(@Inject(Router) private router: Router) { }

  ngOnInit() {
  }

  navigateToAddProjectPage() {
    this.router.navigate(['/add-project']);
  }
}
