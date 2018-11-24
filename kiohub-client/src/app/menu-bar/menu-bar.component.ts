import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../model/user.interface';
import { address } from '../services/project.service';
import { UserService } from '../services/user.service';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  pathToLogo: string;
  currentUser: User;
  valueUtils = new ValueUtils();
  private addressToLogOut = address + '/login/logout';
  constructor(@Inject(UserService) private userService: UserService) {
    this.pathToLogo = '../../assets/logo/logo4.png';
  }
  ngOnInit() {
    this.userService.getCurrentUser().subscribe(x => this.currentUser = x);
  }

  isUserDefined(): boolean {
    return !this.valueUtils.isNullOrUndefined(this.currentUser);
  }
}
