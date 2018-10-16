import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { trigger, transition, animate, style } from '../../../node_modules/@angular/animations';
import { Router } from '../../../node_modules/@angular/router';
import { Project } from '../model/project.interface';
import { MatTableDataSource, MatPaginator } from '../../../node_modules/@angular/material';
import { ProjectService } from '../services/project.service';
import { ValueUtils } from '../error-info/value-utils';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';

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
  showNoResultsLabel: boolean;
  projects: Project[];
  dataSource: MatTableDataSource<Project>;
  displayedColumns: string[] = ['results', 'menu'];
  paginator: MatPaginator;
  valueUtils = new ValueUtils();
  currentUser: User;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp; this.assignPaginatorToDataSource(); }
  constructor(@Inject(Router) private router: Router, @Inject(ProjectService) private projectService: ProjectService,
                @Inject(UserService) private userService: UserService) { }

  ngOnInit() {
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
}
