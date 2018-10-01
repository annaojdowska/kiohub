import { Component, OnInit, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

  setText(text: string) {
    this.text = text;
  }

  setAttachmentUploadInfoText(currentNr: number, size: number, filename: string) {
    this.text = 'Trwa dodawanie załącznika "' + filename + '" (załącznik ' + currentNr + ' z ' + size + ')';
  }
}
