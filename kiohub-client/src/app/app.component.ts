import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './model/user.interface';
import { ValueUtils } from './utils/value-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isLogged = false;
  currentUser: User;
  valueUtils = new ValueUtils();
  public constructor(@Inject(UserService) private userService: UserService) {}

  ngOnInit(): void {
    console.log('APP COMPO ON INIT');
     this.userService.isLogged().subscribe(x => {this.isLogged = x;
    console.log('IsLogged has arrived: ' + this.isLogged); });
  }
}
