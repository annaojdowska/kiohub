import { Component, OnInit } from '@angular/core';
import { address } from '../services/project.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  pathToLogo: string;
  private addressToLogOut = address + '/login/logout';
  constructor() {
    this.pathToLogo = '../../assets/logo/logo4.png';
   }
  ngOnInit() {
  }
}
