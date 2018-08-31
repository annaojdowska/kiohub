import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Project } from '../model/project.interface';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { ProjectService } from '../services/project.service';
import { DownloadElementComponent } from '../ui-elements/download-element/download-element.component';
import { AttachmentType } from '../model/attachment-type.enum';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  @ViewChild('downloadThesis') downloadThesis: DownloadElementComponent;
  @ViewChild('downloadSourceCode') downloadSourceCode: DownloadElementComponent;
  @ViewChild('downloadUsage') downloadUsage: DownloadElementComponent;
  @ViewChild('downloadStartup') downloadStartup: DownloadElementComponent;
  @ViewChild('downloadOther') downloadOther: DownloadElementComponent;

  supervisor: User;
  collaborators: User[];
  project: Project;
  id: number;

  constructor(@Inject(UserService) private userService: UserService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(ProjectService) private projectService: ProjectService) {

    // this.route.params.subscribe(routeParams => {
    //      this.id = routeParams.id;
    //      this.project = this.projectService.getProjectByIdFromCache(this.id);
    //      this.initData(this.id);
    // });
  }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      this.getItem(this.id).then(project => {
        this.project = project;
        this.initData(this.project.id);
        this.downloadThesis.attachments = this.project.attachments;

        this.downloadThesis.refreshAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.THESIS));
        this.downloadSourceCode.refreshAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.SOURCE_CODE));
        this.downloadUsage.refreshAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.MANUAL_USAGE));
        this.downloadStartup.refreshAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.MANUAL_STARTUP));
        this.downloadOther.refreshAttachments(this.project.attachments.filter(
          attachment => attachment.type === AttachmentType.OTHER));
      });
    });
    // FIXME a co jak error?
  }

  async getItem(id: number) {
    return await this.projectService.getProjectById(this.id).toPromise();
  }

  initData(projectId: number) {
    this.userService.getCollaboratorsByProjectId(projectId).subscribe(result => this.collaborators = result);
    this.userService.getSupervisorByProjectId(projectId).subscribe(result => this.supervisor = result);
  }
}
