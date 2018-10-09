import { Component, Inject } from '@angular/core';
import { UserService } from './services/user.service';
import { ValueUtils } from './error-info/value-utils';
import { User } from './model/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  isLogged = false;
  currentUser: User;
  valueUtils = new ValueUtils();
  public constructor(@Inject(UserService) userService: UserService) {
    const toSubscribe = userService.getCurrentUser();
    if (toSubscribe !== undefined) {
      toSubscribe.subscribe(x => {
      this.currentUser = x;
      console.log(this.currentUser.firstName);
      this.isLogged = !this.valueUtils.isNullOrUndefined(this.currentUser);
    });
  }
  }
}
