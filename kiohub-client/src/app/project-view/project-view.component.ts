import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { ImageSliderComponent } from '../image-slider/image-slider.component';
import { AttachmentType } from '../model/attachment-type.enum';
import { Project } from '../model/project.interface';
import { UserEmail } from '../model/user-email.interface';
import { User } from '../model/user.interface';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { DownloadElementComponent } from '../ui-elements/download-element/download-element.component';
import { FileDownloaderView } from '../ui-elements/download-element/file-downloader-view';
import { SpinnerDownloadAttachmentComponent } from '../ui-elements/spinner/spinner-download-attachment/spinner-download-attachment.component';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ height: '0px' }),
        animate('500ms linear', style({ height: '*' }))
      ]),
      transition(':leave', [
        animate('500ms linear', style({ height: '0px' }))
      ])
    ])
  ]
})
export class ProjectViewComponent implements OnInit, FileDownloaderView {
  @ViewChild('downloadThesis') downloadThesis: DownloadElementComponent;
  @ViewChild('downloadSourceCode') downloadSourceCode: DownloadElementComponent;
  @ViewChild('downloadUsage') downloadUsage: DownloadElementComponent;
  @ViewChild('downloadStartup') downloadStartup: DownloadElementComponent;
  @ViewChild('downloadOther') downloadOther: DownloadElementComponent;
  @ViewChild('slider') imageSlider: ImageSliderComponent;
  @ViewChild('downloadSpinner') downloadSpinner: SpinnerDownloadAttachmentComponent;
  @ViewChild('previewModeInfo') previewModeInfo: ErrorInfoComponent;

  valueUtils = new ValueUtils();
  supervisor: User;
  collaborators: UserEmail[];
  project: Project;
  id: number;
  relatedProjects: Project[];
  descriptionHidden;
  filesHidden;
  authorsHidden;
  supervisorHidden;
  semestersHidden;
  tagsHidden;
  licenceHidden;
  relatedProjectsHidden;
  publicationDateHidden;
  projectTypeHidden;
  detailsHidden;
  authorsLabelHidden;
  loggedIsCollaborator;

  constructor(@Inject(UserService) private userService: UserService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(ProjectService) private projectService: ProjectService) {
    this.collaborators = [];
    this.descriptionHidden = true;
    this.filesHidden = true;
    this.authorsHidden = true;
    this.supervisorHidden = true;
    this.tagsHidden = true;
    this.semestersHidden = true;
    this.licenceHidden = true;
    this.relatedProjectsHidden = true;
    this.publicationDateHidden = true;
    this.projectTypeHidden = true;
    this.detailsHidden = true;
    this.authorsLabelHidden = true;
    this.loggedIsCollaborator = false;
  }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      this.getItem(this.id).then(project => {
        if (!project.published) {
          this.previewModeInfo.setDisplay(true);
        } else {
          this.previewModeInfo.setDisplay(false);
        }
        this.project = project;
        this.initData(this.project.id);
        this.userService.loggedIsCollaborator(this.project.id).subscribe(isCollaborator => this.loggedIsCollaborator = isCollaborator);
        this.downloadThesis.attachments = this.project.attachments;

        this.imageSlider.setImages(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.PHOTO)
        );
        this.downloadThesis.setAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.THESIS)
        );
        this.downloadSourceCode.setAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.SOURCE_CODE)
        );
        this.downloadUsage.setAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.MANUAL_USAGE)
        );
        this.downloadStartup.setAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.MANUAL_STARTUP)
        );
        this.downloadOther.setAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.OTHER)
        );
        this.manageVisibility(project);
      });
    });
    this.setDownloadElements();
  }

  async getItem(id: number) {
    return await this.projectService.getProjectById(this.id).toPromise();
  }

  initData(projectId: number) {
    this.userService.getCollaboratorsByProjectId(projectId).subscribe(result => {
      this.collaborators = result;
      this.manageAuthorsVisibility(result);
    });
    this.projectService.getRelatedProjects(projectId).subscribe(result => {
      const filteredRelatedProjects = result.filter(project => project.published === true);
      this.relatedProjects = filteredRelatedProjects;
      this.manageRelatedProjectsVisibility(filteredRelatedProjects);
    });
  }

  manageAuthorsVisibility(result) {
    this.userService.getSupervisorByProjectId(this.id).subscribe(sup => {
      this.supervisor = sup;
      if (result.filter(p => p.user.firstName !== '' && p.user.lastName !== '').length > 0) {
        this.authorsHidden = false;
        this.authorsLabelHidden = false;
      } else {
        this.authorsHidden = true;
        if (!this.valueUtils.isNullOrUndefined(sup)) {
          this.authorsLabelHidden = false;
        }
      }
      this.manageSupervisorVisibility(sup);
    });
  }

  manageSupervisorVisibility(result: User) {
    if (!this.valueUtils.isNullOrUndefined(result)) {
      this.supervisorHidden = false;
    } else {
      this.supervisorHidden = true;
    }
  }

  manageVisibility(project: Project) {
    if (project.descriptionEng) {
      this.descriptionHidden = false;
    } else {
      this.descriptionHidden = true;
    }
    if (project.attachments.filter(att => att.type !== AttachmentType.PHOTO).length > 0) {
      this.filesHidden = false;
    } else {
      this.filesHidden = true;
    }
    if (project.tags.length > 0 || project.semesters.length > 0 || project.licence && project.licence.name !== 'Brak'
      || project.publicationDate || project.projectType) {
      this.detailsHidden = false;
      if (project.tags.length > 0) {
        this.tagsHidden = false;
      } else {
        this.tagsHidden = true;
      }
      if (project.semesters.length > 0) {
        this.semestersHidden = false;
      } else {
        this.semestersHidden = true;
      }
      if (project.licence && project.licence.name !== 'Brak') {
        this.licenceHidden = false;
      } else {
        this.licenceHidden = true;
      }
      if (project.publicationDate) {
        this.publicationDateHidden = false;
      } else {
        this.publicationDateHidden = true;
      }
      if (project.projectType) {
        this.projectTypeHidden = false;
      } else {
        this.projectTypeHidden = true;
      }
    } else {
      this.detailsHidden = true;
    }
  }

  manageRelatedProjectsVisibility(relatedProjects: Project[]) {
    if (relatedProjects.length > 0) {
      this.relatedProjectsHidden = false;
    } else {
      this.relatedProjectsHidden = true;
    }
  }

  setDownloadElements() {
    this.downloadOther.setView(this, this.downloadSpinner);
    this.downloadSourceCode.setView(this, this.downloadSpinner);
    this.downloadStartup.setView(this, this.downloadSpinner);
    this.downloadThesis.setView(this, this.downloadSpinner);
    this.downloadUsage.setView(this, this.downloadSpinner);
  }

  onBeginDownloding(filename: string) {
    this.downloadSpinner.begin(this);
  }

  onDownloadingCompleted() {
    this.downloadSpinner.setDisplay(false);
  }
}
