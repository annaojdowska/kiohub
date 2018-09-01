import { Component, OnInit, Inject } from '@angular/core';
import { AttachmentService } from '../services/attachment.service';
import { Attachment } from '../model/attachment.interface';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  imagesUrl: string[];
  constructor(@Inject(AttachmentService) private attachmentService: AttachmentService) { }
  imageToShow;

  ngOnInit() {
    this.imagesUrl = [

    ];
    // [
    //   '../assets/add-photo.png',
    //   '../assets/add-project.png',
    //   '../assets/add.png',
    //   ];
  }

  setImages(attachments: Attachment[]) {

    for (const attachment of attachments) {
      this.attachmentService.getAttachment(attachment.id).subscribe((image: Blob) => {
        // zamiana bloba na obrazek do wyświetlenia w base64
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imageToShow = reader.result;
          // dodanie obrazka do tablicy obrazków do wyświetlenia
          this.imagesUrl.push(this.imageToShow);
        }, false);

        if (image) {
          reader.readAsDataURL(image);
        }
      }, error => console.log('No such file on server'));
    }
    console.log(this.imagesUrl);
  }
}
