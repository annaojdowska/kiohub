import { Component, OnInit, Input } from '@angular/core';
import { Attachment } from '../../model/attachment.interface';

@Component({
  selector: 'app-download-element',
  templateUrl: './download-element.component.html',
  styleUrls: ['./download-element.component.css']
})
export class DownloadElementComponent implements OnInit {

  @Input() title: string;
  @Input() attachments: Attachment[];
  constructor() { }

  ngOnInit() {
    this.attachments = [];
  }

  refreshAttachments(attachments: Attachment[]) {
    if (attachments !== null) {
      this.attachments = attachments;
      console.log('att!');
      console.log(this.attachments);
    } else {
      console.log('null!');
    }
  }
}
