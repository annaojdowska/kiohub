import { Component, Inject, OnInit, Input } from '@angular/core';
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
  @Input() hideSearch;
  displaySearch;

  private addressToLogOut = address + '/login/logout';
  constructor(@Inject(UserService) private userService: UserService) {
    this.pathToLogo = '../../assets/logo/logo4.png';
  }

  hideSearchIfNecessary(): any {
    this.displaySearch = this.valueUtils.setDisplay(this.hideSearch !== 'true');
  }

  ngOnInit() {
    this.hideSearchIfNecessary();
    this.userService.getCurrentUser().subscribe(x => this.currentUser = x);
  }

  isUserDefined(): boolean {
    return !this.valueUtils.isNullOrUndefined(this.currentUser);
  }
}
