import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IImage } from 'ng-simple-slideshow/src/app/modules/slideshow/IImage';
import { MatDialog } from '@angular/material';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { Attachment } from '../model/attachment.interface';
import { AttachmentService } from '../services/attachment.service';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  @ViewChild('slider') slider: any;
  images: IImage[];
  color: 'red';
  valueUtils = new ValueUtils();
  hidden;

  constructor(@Inject(AttachmentService) private attachmentService: AttachmentService,
    @Inject(MatDialog) private dialog: MatDialog) {
    this.images = [];
    this.hidden = true;
  }

  ngOnInit() {
    this.images = [];
  }

  setImages(attachments: Attachment[]) {
    this.images = [];
    let loadedImages = 0;
    const imagesToLoad = attachments.length;

    for (const attachment of attachments) {
      this.attachmentService.getAttachment(attachment.id).subscribe((image: Blob) => {
        // blob -> image in base64
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const imageToShow = reader.result;
          // adding image to array of elements to be displayed
          let iImage;
          iImage = { url: imageToShow };
          this.images.push(iImage);
          if (++loadedImages === imagesToLoad) {
            this.setHidden(false);
          }
        }, false);
        if (image) {
          reader.readAsDataURL(image);
        }
      });
    }
  }

  setHidden(value: boolean) {
    this.hidden = value;
  }

  manageSliderVisibility(attachments: Attachment[]) {
    if (attachments.length > 0) {
      this.setHidden(false);
    } else {
      this.setHidden(true);
    }
  }

  onClick(event: MouseEvent) {
    if (event.srcElement.classList.contains('slides')) {
      this.dialog.open(ImageDialogComponent, { data: this.slider.slides[this.slider.slideIndex].image.url });
    }
  }
}
