import { Component, Inject } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  isLogged = false;
  public constructor(@Inject(UserService) userService: UserService) {
    this.isLogged = userService.getCurrentUser(); // we'll have to change it to some Observable or smth
  }
}
