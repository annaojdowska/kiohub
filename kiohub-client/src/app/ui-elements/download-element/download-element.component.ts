import { Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
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
  @ViewChild('container') container: ElementRef;
  constructor(@Inject(AttachmentService) private attachmentService: AttachmentService) { }

  ngOnInit() {
    this.attachments = [];
  }

  refreshAttachments(attachments: Attachment[]) {
    if (attachments !== null) {
      this.attachments = attachments;
      // this.container.nativeElement.style.add = 'elo ziomeczki co tam!';
      console.log(this.container);
    } else {
      console.log('null!');
    }
  }

  downloadFile(attachment: Attachment) {
    this.attachmentService.getAttachment(attachment.id).subscribe((blob: Blob) => {
      saveAs(blob, attachment.fileName);
    });
  }

}
