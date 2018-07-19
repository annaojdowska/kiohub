import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-bar-not-logged',
  templateUrl: './menu-bar-not-logged.component.html',
  styleUrls: ['./menu-bar-not-logged.component.css']
})
export class MenuBarNotLoggedComponent implements OnInit {
  pathToLogo: string;
  constructor() {
    this.pathToLogo = '../../assets/kio_logo.png';
   }
  ngOnInit() {
  }
}
