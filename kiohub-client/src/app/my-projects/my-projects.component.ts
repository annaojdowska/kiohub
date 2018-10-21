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
import { SortingService } from '../services/sorting-service';
import { QueryDescription } from '../model/helpers/query-description.class';
import { FilterService } from '../services/filter.service';
import { UserPinnedProjectsService } from '../services/user-pinned-projects.service';
import { LoginService } from '../services/login.service';

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
  displayedProjects: Project[];
  dataSource: MatTableDataSource<Project>;
  displayedColumns: string[] = ['results'];
  paginator: MatPaginator;
  sortingRules: string[];
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
              @Inject(LoginService) private loginService: LoginService,
              @Inject(SortingService) private sortingService: SortingService,
              @Inject(UserPinnedProjectsService) private userPinnedProjectsService: UserPinnedProjectsService,
              @Inject(FilterService) private filterService: FilterService) { }

  ngOnInit() {
    this.sortingRules = [this.sortingService.alphabetical,
      this.sortingService.by_publication_date_descending,
      this.sortingService.by_publication_date_ascending];
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
          this.displayedProjects = this.projects;
          this.sortAndSetByPinned();
        });
      }});

    // debug
      // this.projectService.getProjectsByCollaboratorId(868)
      // .subscribe(results => {
      //   this.projects = results;
      //   this.displayedProjects = this.projects;
      //   this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
      // });
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
   this.executeFilterByStatus(statusName);
  }

  executeFilterByStatus(status: string) {
    this.displayedProjects = this.projects.filter(project => project.projectStatus.name === status);
    this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
    this.sortAndSetByPinned();
  }

  getSearchResults(query: QueryDescription) {
    console.log('SUBMIT in get search results');
    this.filterService.filterBasedOnQuery(query, this.projects);
  }

  applySorting(sortingRule: string) {
    if (sortingRule === this.sortingService.alphabetical) {
      this.displayedProjects = this.displayedProjects
        .sort((a, b) => this.sortingService.sortAlphabetically(a.title, b.title));
    } else if (sortingRule === this.sortingService.by_publication_date_descending) {
      this.displayedProjects = this.displayedProjects
        .sort((a, b) => this.sortingService.sortByDateDescending(a.publicationDate, b.publicationDate));
    } else if (sortingRule === this.sortingService.by_publication_date_ascending) {
      this.displayedProjects = this.displayedProjects
      .sort((a, b) => this.sortingService.sortByDateAscending(a.publicationDate, b.publicationDate));
    }
    this.sortAndSetByPinned();
  }

  readDisplayedProjectsLength(): number {
    if (this.valueUtils.isNullOrUndefined(this.displayedProjects)) {
      return 0;
    } else {
      return this.displayedProjects.length;
    }
  }

  sortAndSetByPinned() {
    this.loginService.getLogged().subscribe(user => {
      if (user) {
        this.userPinnedProjectsService.allPinned(user.id).subscribe(pinneds => {
          if (!this.valueUtils.isNullOrUndefined(this.displayedProjects)) {
          this.displayedProjects = this.displayedProjects
          .sort((a, b) => this.sortingService.sortByPinned(pinneds.includes(a.id), pinneds.includes(b.id)));
          this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
          this.assignPaginatorToDataSource();
        }});
      } else {
        this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
        this.assignPaginatorToDataSource();
      }
    });
  }
}
