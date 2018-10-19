import { Component, OnInit, Inject, ViewChild, EventEmitter, Output } from '@angular/core';
import { trigger, transition, animate, style } from '../../../node_modules/@angular/animations';
import { Router } from '../../../node_modules/@angular/router';
import { Project } from '../model/project.interface';
import { MatTableDataSource, MatPaginator } from '../../../node_modules/@angular/material';
import { ProjectService } from '../services/project.service';
import { ValueUtils } from '../error-info/value-utils';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { ProjectStatusService } from '../services/project-status-service';
import { ProjectStatus } from '../model/project-status.interface';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({height: '0px'}),
      animate('500ms linear', style({height: '*'}))
      ]),
      transition(':leave', [
      animate('500ms linear', style({height: '0px'}))
      ])
    ])
  ]
})
export class MyProjectsComponent implements OnInit {
  readonly statusInProgress = 'W trakcie';
  readonly statusClosed = 'Zakończony';
  readonly statusProblematic = 'Problematyczny';
  showNoResultsLabel: boolean;
  projects: Project[];
  dataSource: MatTableDataSource<Project>;
  displayedColumns: string[] = ['results', 'menu'];
  paginator: MatPaginator;
  valueUtils = new ValueUtils();
  currentUser: User;
  checkedInProgress: boolean;
  checkedClosed: boolean;
  checkedProblematic: boolean;
  projectStatuses: ProjectStatus[];
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp; this.assignPaginatorToDataSource(); }
  constructor(@Inject(Router) private router: Router,
              @Inject(ProjectService) private projectService: ProjectService,
              @Inject(UserService) private userService: UserService,
              @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService,
              @Inject(SearchService) private searchService: SearchService) { }

  ngOnInit() {
    this.checkedClosed = false;
    this.checkedInProgress = false;
    this.checkedProblematic = false;
    this.projectStatusService.getStatuses().subscribe(result => this.projectStatuses = result);
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (!this.valueUtils.isNullOrUndefined(this.currentUser)) {
        this.projectService.getProjectsByCollaboratorId(this.currentUser.id)
        .subscribe(results => {
          this.projects = results;
          this.dataSource = new MatTableDataSource<Project>(this.projects);
        });
      } else {
        this.projectService.getProjectsByCollaboratorId(868)
        .subscribe(results => {
          this.projects = results;
          this.dataSource = new MatTableDataSource<Project>(this.projects);
      });
    }
    });
  }

  navigateToAddProjectPage() {
    this.router.navigate(['/add-project']);
  }

  private assignPaginatorToDataSource(): void {
    if (this.valueUtils.isNullOrUndefined(this.dataSource)) {
      return;
    }
    this.dataSource.paginator = this.paginator;
  }

  displayPaginator(): boolean {
    if (this.valueUtils.isNullOrUndefined(this.projects)) {
      return false;
    } else {
      return this.projects.length > 0;
    }
  }

  checkButton(inProgress: boolean, closed: boolean, problematic: boolean) {
    this.checkedInProgress = inProgress;
    this.checkedClosed = closed;
    this.checkedProblematic = problematic;
  }

  filterByStatus(statusName: string) {
    if (statusName === this.statusInProgress) {
      this.checkButton(true, false, false);
    } else if (statusName === this.statusClosed) {
      this.checkButton(false, true, false);
    } else {
      this.checkButton(false, false, true);
    }
    this.getSearchResults(this.projectStatuses.find(pr => pr.name === statusName.toString()).id);
  }

  getSearchResults(statusId: number) {
    this.searchService.getProjectsBasedOnStatus(statusId, this.currentUser.id).subscribe(results => {
      this.projects = results;
      this.dataSource = new MatTableDataSource<Project>(this.projects);
    });
  }


}
