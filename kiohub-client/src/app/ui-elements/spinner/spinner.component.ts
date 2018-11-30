import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ValueUtils } from '../../utils/value-utils';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input() protected text: string;
  protected valueUtils = new ValueUtils();
  protected display = 'none';

  constructor() {
  }

  ngOnInit() {
  }

  showSpinner(text: string) {
    this.setText(text);
    this.setDisplay(true);
  }

  setText(text: string) {
    this.text = text;
  }

  setDisplay(isVisible: boolean) {
    if (isVisible) {
      this.display = 'block';
    } else {
      this.display = 'none';
    }
  }
}
