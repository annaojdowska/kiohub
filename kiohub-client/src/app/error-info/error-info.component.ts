import { Component, OnInit, Input } from '@angular/core';
import { ErrorType } from './error-type.enum';
import { ValueUtils } from './value-utils';

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
  valueUtils = new ValueUtils();

  ngOnInit() {
    this.setType(this.errorType);
  }

  setDisplay(isVisible: boolean) {
    this.display = this.valueUtils.setDisplay(isVisible);
  }

  setType(newType) {
    if (newType === (ErrorType.ERROR)) {
      this.error = true;
      this.success = false;
      this.warning = false;
    } else if (newType === (ErrorType.WARNING)) {
      this.error = false;
      this.success = false;
      this.warning = true;
    } else if (newType === (ErrorType.SUCCESS)) {
      this.error = false;
      this.success = true;
      this.warning = false;
    }
  }

  setText(newText) {
    this.errorText = newText;
  }

  setComponent(isVisible, newType, newText) {
    this.setDisplay(isVisible);
    this.setType(newType);
    this.setText(newText);
  }
}
