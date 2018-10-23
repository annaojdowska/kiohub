import { Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Attachment } from '../../model/attachment.interface';
import { AttachmentService } from '../../services/attachment.service';
import { saveAs } from 'file-saver/FileSaver';
import { FileDownloaderView } from './file-downloader-view';

@Component({
  selector: 'app-download-element',
  templateUrl: './download-element.component.html',
  styleUrls: ['./download-element.component.css']
})
export class DownloadElementComponent implements OnInit {
  hidden;
  @Input() title: string;
  @Input() attachments: Attachment[];
  @ViewChild('container') container: ElementRef;
  view: FileDownloaderView;

  constructor(@Inject(AttachmentService) private attachmentService: AttachmentService, view: FileDownloaderView) {
    this.hidden = true;
  }

  ngOnInit() {
    this.attachments = [];
  }

  setAttachments(attachments: Attachment[]) {
    if (attachments !== null) {
      this.attachments = attachments;
      this.manageVisibility();
      // this.container.nativeElement.style.add = 'elo ziomeczki co tam!';
      // console.log(this.container);
    } else {
      console.log('null!');
    }
  }

  downloadFile(attachment: Attachment) {
    this.view.onBeginDownloding(attachment.fileName);
    this.attachmentService.getAttachment(attachment.id).subscribe((blob: Blob) => {
      console.log('start!');
      saveAs(blob, attachment.fileName);
      console.log('koniec!');
      this.view.onDownloadingCompleted();
    });
  }

  manageVisibility() {
    if (this.attachments.length > 0) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }

  setView(view: FileDownloaderView) {
    this.view = view;
  }
}
