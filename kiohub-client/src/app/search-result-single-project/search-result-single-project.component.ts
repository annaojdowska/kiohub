import { Component, OnInit, Input, Inject, AfterContentInit } from '@angular/core';
import { Project } from '../model/project.interface';
import { Router } from '../../../node_modules/@angular/router';
import { AttachmentService } from '../services/attachment.service';
import { Observable } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-search-result-single-project',
  templateUrl: './search-result-single-project.component.html',
  styleUrls: ['./search-result-single-project.component.css']
})
export class SearchResultSingleProjectComponent implements OnInit, AfterContentInit {
  @Input() project: Project;
  private descriptionToDisplay: string;
  private numberOfCharsToDisplay = 300;
  private mainPhoto: Observable<Blob>;
  private showDefault: boolean;
  private brokenImage = '../../assets/broken-image.png';
  constructor(@Inject(Router) private router: Router,
   @Inject(AttachmentService) private attachmentService: AttachmentService) { }

  ngOnInit() {
    this.showDefault = true;
  }

  ngAfterContentInit(): void {
    this.getImageFromService();
    this.initializeDescriptionDisplay();
  }

  navigateToDetails() {
    this.router.navigate(['/details', this.project.id]);
  }

  getImageFromService() {
    const id = this.getMainPhotoId();
    if (id !== -1) {
      this.attachmentService.getPhotoAttachment(id).subscribe(data => {
      this.createImageFromBlob(data);
      this.showDefault = false;
      }, error => console.log('No such file on server'));
    }
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.mainPhoto = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private getMainPhotoId(): number {
    const mainPhoto = this.project.attachments.find(attachment => attachment.mainPhoto === true);
    if (mainPhoto === undefined) {
      return -1;
    } else {
      return mainPhoto.id;
    }
  }

  private initializeDescriptionDisplay() {
    if (this.project.description != null) {
      if (this.project.description.length > this.numberOfCharsToDisplay) {
        this.descriptionToDisplay = this.project.description.slice(0, this.numberOfCharsToDisplay);
        this.descriptionToDisplay += '...';
      } else {
      this.descriptionToDisplay = this.project.description;
      }
    }
  }
}
