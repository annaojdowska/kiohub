import { AfterContentInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InputListComponent } from '../input-list/input-list.component';
import { Project } from '../model/project.interface';
import { SearchResultSingleProjectOptionsComponent } from '../search-result-single-project-options/search-result-single-project-options.component';
import { AttachmentService } from '../services/attachment.service';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { UserPinnedProjectsService } from '../services/user-pinned-projects.service';

@Component({
  selector: 'app-search-result-single-project',
  templateUrl: './search-result-single-project.component.html',
  styleUrls: ['./search-result-single-project.component.css']
})
export class SearchResultSingleProjectComponent implements OnInit, AfterContentInit {
  @Input() project: Project;
  @Input() allowPin = false;
  @Input() allowEdit = false;
  @Input() allowCollaboratedIcon = false;
  @Input() showIfPublished: boolean;
  @ViewChild('tagsList') tagsList: InputListComponent;
  @ViewChild('options') options: SearchResultSingleProjectOptionsComponent;
  private descriptionToDisplay: string;
  private numberOfCharsToDisplay = 300;
  private mainPhoto: Observable<Blob>;
  private showDefault: boolean;
  private brokenImage = '../../assets/broken-image.png';
  private start: string;
  private end: string;
  constructor(@Inject(Router) private router: Router,
    @Inject(AttachmentService) private attachmentService: AttachmentService,
    @Inject(UserPinnedProjectsService) private userPinnedProjectsService: UserPinnedProjectsService,
    @Inject(UserService) private userService: UserService,
    @Inject(LoginService) private loginService: LoginService) { }
  @Output() pinUpdate = new EventEmitter();

  ngOnInit() {
    this.showDefault = true;
    if (this.allowEdit || this.allowPin) {
      this.loginService.getLogged().subscribe(user => {
        if (user) {
          const userId = user.id;
          this.userPinnedProjectsService.isPinned(userId, this.project.id).subscribe(data => {
            this.options.pinned = data;
            this.options.pinnedTextRefresh();
          });
        }
      });
    }
    if (this.allowCollaboratedIcon) {
      this.userService.loggedIsCollaborator(this.project.id).subscribe(isCollabolator => {
            this.options.collaborated = <boolean>isCollabolator;
        });
    }


  }

  ngAfterContentInit(): void {
    this.getImageFromService();
    this.initializeDescriptionDisplay();
    this.project.tags.forEach(tag => this.tagsList.add({ name: tag.name }));
  }

  pinOptionsUpdate() {
    this.pinUpdate.emit();
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
      });
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

  displayPublished(): boolean {
    if (this.showIfPublished) {
      return this.showIfPublished;
    } else {
      return false;
    }
  }

  displayPublicationState(): string {
    if (this.project) {
      return this.project.published ? '(opublikowany)' : '(nieopublikowany)';
    } else {
      return '';
    }
  }
}
