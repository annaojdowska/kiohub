import { Component, OnInit, Input, Inject } from '@angular/core';
import { Attachment } from '../../model/attachment.interface';
import { AttachmentService } from '../../services/attachment.service';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-download-element',
  templateUrl: './download-element.component.html',
  styleUrls: ['./download-element.component.css']
})
export class DownloadElementComponent implements OnInit {

  @Input() title: string;
  @Input() attachments: Attachment[];
  constructor(@Inject(AttachmentService) private attachmentService: AttachmentService) { }

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

  downloadFile(id: number) {
    if (id !== undefined) {
      console.log('po');
      this.attachmentService.getAttachment(id).subscribe((blob: Blob) => {
        console.log(blob);
        saveAs(blob, 'zalacznik');
      }, error => console.log('No such file on server'));
    }
  }

}
