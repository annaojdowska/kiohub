import { Component, OnInit, Inject } from '@angular/core';
import { AttachmentService } from '../services/attachment.service';
import { Attachment } from '../model/attachment.interface';
// import { SliderModule } from 'angular-image-slider';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  // @ViewChild('slider') slider: DownloadElementComponent;
  imagesUrl: string[];
  imageToShow;
  // visibility = 'false';

  constructor(@Inject(AttachmentService) private attachmentService: AttachmentService) { 
    this.imagesUrl = [];}
  ngOnInit() {
    this.imagesUrl = [];
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
         // this.visibility = 'false';
        }, false);

        if (image) {
          reader.readAsDataURL(image);
        }
      }, error => console.log('No such file on server'));
    }
    // if (this.imagesUrl.length === 0) {
    //   this.visibility = 'true';
    // }
    console.log(this.imagesUrl);
  }
}
