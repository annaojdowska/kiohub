import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { ValueUtils } from '../utils/value-utils';
import { ErrorType } from '../error-info/error-type.enum';

@Component({
  selector: 'app-unlogged-search',
  templateUrl: './unlogged-search.component.html',
  styleUrls: ['./unlogged-search.component.css']
})
export class UnloggedSearchComponent implements OnInit {

  pathToSearchIcon: string;
  private valueUtils = new ValueUtils();

  @ViewChild('info') info: ErrorInfoComponent;

  constructor() {
    this.pathToSearchIcon = '../../assets/search_icon.svg';
  }

  ngOnInit() {
    this.getDataFromLocalStorage();
  }

  getDataFromLocalStorage() {
    if (this.valueUtils.getAndRemoveFromSession(this.valueUtils.deletedProjectBoolean)) {
      this.info.setComponent(true, ErrorType.SUCCESS, 'Usunięto projekt.');
    } else if (this.valueUtils.getAndRemoveFromSession(this.valueUtils.unauthorizedBoolean)) {
      this.info.setComponent(true, ErrorType.ERROR, 'Nie masz uprawnień do wyświetlenia tego zasobu lub podana strona nie istnieje.');
    } else {
      this.info.setDisplay(false);
    }
  }
}
