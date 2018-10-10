import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { ValueUtils } from './error-info/value-utils';
import { User } from './model/user.interface';

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
    console.log('APP COMPO ON INIT 2');
     this.userService.isLogged().subscribe(x => this.isLogged = x);
  }
}
