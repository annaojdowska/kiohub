import { Component, OnInit, Input } from '@angular/core';
import {ErrorType } from './error-type.enum';

@Component({
  selector: 'app-error-info',
  templateUrl: './error-info.component.html',
  styleUrls: ['./error-info.component.css']
})
export class ErrorInfoComponent implements OnInit {
@Input() errorText: string;
@Input() errorType: ErrorType;
success: boolean;
warning: boolean;
error: boolean;
display = 'none';

  ngOnInit() {
    if (this.errorType === (ErrorType.ERROR)) {
      this.error = true;
    } else if (this.errorType === (ErrorType.WARNING)) {
      this.warning = true;
    } else if (this.errorType === (ErrorType.SUCCESS)) {
      this.success = true;
    } else {
      console.log('Niepoprawny styl błędu!');
    }
  }

  setDisplay(isVisible: boolean) {
    if (isVisible) {
      this.display = 'block';
    } else {
      this.display = 'none';
    }
  }

}
