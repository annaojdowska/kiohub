import { Component, OnInit } from '@angular/core';
import { address } from '../services/project.service';

@Component({
  selector: 'app-menu-bar-not-logged',
  templateUrl: './menu-bar-not-logged.component.html',
  styleUrls: ['./menu-bar-not-logged.component.css']
})

export class MenuBarNotLoggedComponent implements OnInit {
  pathToLogo: string;
  private addresToLogIn = address + '/login/login';
  constructor() {
    this.pathToLogo = '../../assets/logo/logo4.png';
   }
  ngOnInit() {
  }
}
