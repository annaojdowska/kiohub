import { Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Attachment } from '../../model/attachment.interface';
import { AttachmentService } from '../../services/attachment.service';
import { saveAs } from 'file-saver/FileSaver';
import { FileDownloaderView } from './file-downloader-view';
import { ProjectViewComponent } from '../../project-view/project-view.component';
import { UpdatableSpinner } from '../spinner/updatable-spinner';

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
  view: ProjectViewComponent;
  spinner: UpdatableSpinner;

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
    }
  }

  downloadFile(attachment: Attachment) {
    this.view.onBeginDownloding(attachment.fileName);
    this.attachmentService.getAttachment(attachment.id).subscribe((blob: Blob) => {
      saveAs(blob, attachment.fileName);
      this.spinner.addSuccess(attachment.fileName);
    }, error => {
      this.spinner.addFail(attachment.fileName);
    });
  }

  manageVisibility() {
    if (this.attachments.length > 0) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }

  setView(view: ProjectViewComponent, spinner: UpdatableSpinner) {
    this.view = view;
    this.spinner = spinner;
  }
}
