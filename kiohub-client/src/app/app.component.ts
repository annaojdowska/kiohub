import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './model/user.interface';
import { ValueUtils } from './utils/value-utils';
import { Router } from '@angular/router';

import { detect } from '../../node_modules/detect-browser/index.js'; // require('detect-browser');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isLogged = false;
  currentUser: User;
  private valueUtils = new ValueUtils();
  public display = 'block';

  public constructor(@Inject(UserService) private userService: UserService,
    @Inject(Router) private router: Router) {
    this.detectInternetExplorer();
  }

  ngOnInit(): void {
    this.userService.isLogged().subscribe(x => {
      this.isLogged = x;
    });
  }

  private detectInternetExplorer() {
    // detect if current page is /ie-detected - than there is no need for redirecting
    if (this.isOnInternetExplorerDetectedPage()) {
      this.display = 'none';
    } else {
      // check if browser check had been done before - than there is no need for another check
      let checkedBrowser = this.valueUtils.getDataFromSessionStorage(this.valueUtils.browserChecked);
      if (this.valueUtils.isNullOrUndefined(checkedBrowser)) {
        const browser = detect('detect-browser');
        checkedBrowser = browser.name;
        this.valueUtils.saveToSession(this.valueUtils.browserChecked, checkedBrowser);
      }

      if (checkedBrowser === 'ie') {
        this.display = 'none';
        this.router.navigate(['ie-detected']);
      }
    }
  }

  private isOnInternetExplorerDetectedPage() {
    return !this.valueUtils.isNullOrUndefined(window.location)
      && !this.valueUtils.isNullOrEmpty(window.location.pathname)
      && window.location.pathname === '/ie-detected';
  }
}
