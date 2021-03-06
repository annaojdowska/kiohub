import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { ErrorType } from '../error-info/error-type.enum';
import { QueryDescription, FILTER_DATE_FROM, FILTER_DATE_TO, FILTER_LICENCES,
   FILTER_SEMESTERS, FILTER_STATUS, FILTER_TAGS, FILTER_TYPES,
   FILTER_TITLES } from '../model/helpers/query-description.class';
import { ProjectStatus } from '../model/project-status.interface';
import { Project } from '../model/project.interface';
import { User } from '../model/user.interface';
import { FilterService } from '../services/filter.service';
import { LoginService } from '../services/login.service';
import { ProjectStatusService } from '../services/project-status-service';
import { ProjectService } from '../services/project.service';
import { SortingService } from '../services/sorting-service';
import { UserPinnedProjectsService } from '../services/user-pinned-projects.service';
import { UserService } from '../services/user.service';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css'],
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
export class MyProjectsComponent implements OnInit {
  readonly statusInProgress = 'W trakcie';
  readonly statusClosed = 'Zakończony';
  readonly statusProblematic = 'Problematyczny';

  showNoResultsLabel: boolean;
  projects: Project[];
  displayedProjects: Project[];
  filteredProjects: Project[];
  dataSource: MatTableDataSource<Project>;
  displayedColumns: string[] = ['results'];
  paginator: MatPaginator;
  sortingRules: string[];
  lastSortingRule: string;
  lastFilteredStatus: string;
  valueUtils = new ValueUtils();
  currentUser: User;
  checkedInProgress: boolean;
  checkedClosed: boolean;
  checkedProblematic: boolean;
  projectStatuses: ProjectStatus[];
  userHasNoProjects: boolean;
  isLoggedAndSupervisor = false;
  showFilters = false;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp; this.assignPaginatorToDataSource();
  }
  @ViewChild('noResultsError') noResultsError: ErrorInfoComponent;

  constructor(@Inject(Router) private router: Router,
    @Inject(ProjectService) private projectService: ProjectService,
    @Inject(UserService) private userService: UserService,
    @Inject(ProjectStatusService) private projectStatusService: ProjectStatusService,
    @Inject(LoginService) private loginService: LoginService,
    @Inject(SortingService) private sortingService: SortingService,
    @Inject(UserPinnedProjectsService) private userPinnedProjectsService: UserPinnedProjectsService,
    @Inject(FilterService) private filterService: FilterService) { }

  ngOnInit() {
    this.sortingRules = [this.sortingService.alphabeticallyAZ,
    this.sortingService.alphabeticallyZA];
    this.checkedClosed = false;
    this.checkedInProgress = false;
    this.checkedProblematic = false;
    this.projectStatusService.getStatuses().subscribe(result => this.projectStatuses = result);
    this.userService.isLoggedAndSupervisor().subscribe(result => this.isLoggedAndSupervisor = result);

    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;

      if (!this.valueUtils.isNullOrUndefined(this.currentUser)) {
        this.projectService.getProjectsByCollaboratorId(this.currentUser.id)
          .subscribe(results => {
            this.projects = results;
            this.userHasNoProjects = results.length === 0;
            this.displayedProjects = this.projects;
            this.filteredProjects = this.projects;
            this.sortAndSetByPinned();
            this.showFilters = this.checkIfFiltersAreInSession();
          });
      } else {
        this.noResultsError.setComponent(true, 'WARNING', 'Nie udało się odczytać danych zalogowanego użytkownika. (Czy jesteś zalogowany?)');
      }
    }, error => {
      this.noResultsError.setComponent(true, 'WARNING', 'Nie udało się odczytać danych zalogowanego użytkownika. (Czy jesteś zalogowany?)');
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
    if (statusName) {
      this.lastFilteredStatus = statusName;
      if (statusName === this.statusInProgress) {
        if (this.checkedInProgress) {
          this.clearQuickFiltering();
          return;
        }
        this.checkButton(true, false, false);
      } else if (statusName === this.statusClosed) {
        if (this.checkedClosed) {
          this.clearQuickFiltering();
          return;
        }
        this.checkButton(false, true, false);
      } else {
        if (this.checkedProblematic) {
          this.clearQuickFiltering();
          return;
        }
        this.checkButton(false, false, true);
      }
      this.executeFilterByStatus(statusName);
    }
  }

  clearQuickFiltering() {
    this.checkButton(false, false, false);
    this.lastFilteredStatus = null;
    this.displayedProjects = this.filteredProjects;
    this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
    this.sortAndSetByPinned();
  }

  handleNoResults(value: boolean) {
    this.showNoResultsLabel = value;
    if (value) {
      if (this.userHasNoProjects) {
        this.noResultsError.setComponent(true, ErrorType.WARNING, 'Nie jesteś przypisany do żadnych projektów.');
      } else {
        this.noResultsError.setComponent(true, ErrorType.WARNING, 'Nie znaleziono projektów spełniających zadane kryteria.');
      }
    } else {
      this.noResultsError.setComponent(true, ErrorType.SUCCESS, 'Znaleziono poniższe projekty.');
    }
  }

  executeFilterByStatus(status: string) {
    this.displayedProjects = this.filteredProjects
      .filter(project => project.projectStatus && project.projectStatus.name === status);
    this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
    this.sortAndSetByPinned();
  }

  getSearchResults(query: QueryDescription) {
    this.filteredProjects = this.filterService.filterBasedOnQuery(query, this.projects);
    this.displayedProjects = this.filteredProjects;
    this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
    this.sortAndSetByPinned();
    this.handleNoResults(this.displayedProjects.length === 0);
  }

  applySorting(sortingRule: string) {
    this.lastSortingRule = sortingRule;
    if (sortingRule === this.sortingService.alphabeticallyAZ) {
      this.displayedProjects = this.displayedProjects
        .sort((a, b) => this.sortingService.sortAlphabeticallyAZ(a.title, b.title));
    } else if (sortingRule === this.sortingService.alphabeticallyZA) {
      this.displayedProjects = this.displayedProjects
        .sort((a, b) => this.sortingService.sortAlphabeticallyZA(a.title, b.title));
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

  // For resorting when unpin project
  refreshSortAndFilter() {
    if (!this.valueUtils.isNullOrUndefined(this.currentUser)) {
      this.projectService.getProjectsByCollaboratorId(this.currentUser.id)
        .subscribe(results => {
          this.displayedProjects = results;
          this.filterByStatus(this.lastFilteredStatus);
          this.applySorting(this.lastSortingRule);
          this.sortAndSetByPinned();
        });
    }
  }

  sortAndSetByPinned() {
    this.userPinnedProjectsService.allPinned(this.currentUser.id).subscribe(pinneds => {
      if (!this.valueUtils.isNullOrUndefined(this.displayedProjects)) {
        this.displayedProjects = this.displayedProjects
          .sort((a, b) => this.sortingService.sortByPinned(pinneds.includes(a.id), pinneds.includes(b.id)));
        this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
        this.assignPaginatorToDataSource();
        this.handleNoResults(this.displayedProjects.length === 0);
      }
    });
  }

  removeFilters() {
    this.filteredProjects = this.projects;
    this.displayedProjects = this.projects;
    this.dataSource = new MatTableDataSource<Project>(this.displayedProjects);
    this.sortAndSetByPinned();
  }

  isUserSupervisor(): boolean {
    return this.isLoggedAndSupervisor;
  }

  checkIfFiltersAreInSession(): boolean {
    if (sessionStorage.length === 0 ) {
      return false;
    }
      return sessionStorage.getItem(FILTER_DATE_FROM) !== null && sessionStorage.getItem(FILTER_DATE_FROM) !== 'undefined'
      || sessionStorage.getItem(FILTER_DATE_TO) !== null && sessionStorage.getItem(FILTER_DATE_TO) !== 'undefined'
      || sessionStorage.getItem(FILTER_LICENCES) !== null && sessionStorage.getItem(FILTER_LICENCES).length > 0
      || sessionStorage.getItem(FILTER_SEMESTERS) !== null &&  sessionStorage.getItem(FILTER_SEMESTERS).length > 0
      || sessionStorage.getItem(FILTER_STATUS) !== null && sessionStorage.getItem(FILTER_STATUS).length > 0
      || sessionStorage.getItem(FILTER_TAGS) != null && sessionStorage.getItem(FILTER_TAGS).length > 0
      || sessionStorage.getItem(FILTER_TYPES) !== null && sessionStorage.getItem(FILTER_TYPES).length > 0
      || sessionStorage.getItem(FILTER_TITLES) !== null && sessionStorage.getItem(FILTER_TITLES).length > 0;
  }
}
