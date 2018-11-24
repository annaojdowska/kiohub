import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '../../../node_modules/@angular/material';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { EmailInvitationService } from '../email-invitation-service/email-invitation.service';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { ErrorType } from '../error-info/error-type.enum';
import { InputListComponent } from '../input-list/input-list.component';
import { InputListElement } from '../model/input-list-element';
import { Project } from '../model/project.interface';
import { UserEmail } from '../model/user-email.interface';
import { User } from '../model/user.interface';
import { Visibility } from '../model/visibility.enum';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { DeleteDialogComponent } from '../ui-elements/delete-dialog/delete-dialog.component';
import { ProjectManagementSpinnerComponent } from '../ui-elements/spinner/project-management-spinner/project-management-spinner.component';
import { Validation } from '../utils/validation-patterns';
import { ValueUtils } from '../utils/value-utils';

@Component({
  selector: 'app-edit-project-management-tab',
  templateUrl: './edit-project-management-tab.component.html',
  styleUrls: ['./edit-project-management-tab.component.css']
})
export class EditProjectManagementTabComponent implements OnInit {
  editedProject: Project;
  supervisor: User;
  collaborators: UserEmail[] = [];
  supervisorVisibility: Visibility;
  collaboratorsVisibility: Visibility[] = [];
  validation: Validation = new Validation();
  isLoggedAndSupervisor = false;
  loggedUser: User;
  tooltipVisibility = 'Zmień widoczność elementu.';

  STUDENT_EMAIL_PATTERN = 'student.pg.edu.pl';

  valueUtils = new ValueUtils();
  @ViewChild('authorsList') authorsList: InputListComponent;
  @ViewChild('myselfList') myselfList: InputListComponent;
  @ViewChild('authorInput') authorInput: any;
  @ViewChild('emailError') emailError: ErrorInfoComponent;
  @ViewChild('spinner') spinner: ProjectManagementSpinnerComponent;
  @ViewChild('updateInfo') updateInfo: ErrorInfoComponent;


  getProjectIdFromRouter() {
    let id: number;
    this.route.params.subscribe(routeParams => {
      id = routeParams.id;
    });
    return id;
  }
  constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(ProjectService) private projectService: ProjectService,
    @Inject(UserService) private userService: UserService,
    @Inject(EmailInvitationService) private emailInvitationService: EmailInvitationService,
    @Inject(Router) private router: Router,
    @Inject(MatDialog) private dialog: MatDialog) { }


  ngOnInit() {
    this.isLoggedAndSupervisor = false;
    this.authorsList.elements = [];
    this.myselfList.elements = [];
    this.collaborators = [];
    this.userService.getCurrentUser().subscribe(user => this.loggedUser = user);
    const projectId = this.getProjectIdFromRouter();
    this.projectService.getProjectById(projectId).subscribe(result => {
      this.editedProject = result;
      this.userService.getCollaboratorsByProjectId(projectId).subscribe(c => {
        this.collaborators = c.filter(coll => coll.email.includes(this.STUDENT_EMAIL_PATTERN));
        this.userService.getCollaboratorsDataByProjectId(projectId).subscribe(pc => {
          this.collaborators.forEach(coll => {
            const pcTmp = pc.find(p => p.userId === coll.id);
            if (this.isMyself(pcTmp.userId)) {
              this.myselfList.add({
                id: coll.id, name: coll.user.firstName + ' ' + coll.user.lastName + ' (' + coll.email + ')',
                visibility: (pcTmp && pcTmp.userDataVisible) ? pcTmp.userDataVisible : Visibility.LOGGED_USERS
              });
            } else {
              this.authorsList.add({
                id: coll.id, name: coll.user.firstName + ' ' + coll.user.lastName + ' (' + coll.email + ')',
                visibility: (pcTmp && pcTmp.userDataVisible) ? pcTmp.userDataVisible : Visibility.LOGGED_USERS
              });
            }
          });
        });
      });
      this.userService.getSupervisorByProjectId(projectId).subscribe(s => {
        this.supervisor = s;
        this.isLoggedAndSupervisor = this.loggedUser && this.loggedUser.id === this.supervisor.id;
      });
      this.userService.getSupervisorDataByProjectId(projectId).subscribe(sd => {
        if (sd && sd.userDataVisible) {
          this.supervisorVisibility = sd.userDataVisible;
        } else {
          this.supervisorVisibility = Visibility.EVERYONE;
        }
      });
    });
  }

  checkValidityStudentEmail() {
    return this.validation.validate(this.emailError, this.validation.validateStudentPGEmail(this.authorInput));
  }

  addAuthor() {
    if (this.checkValidityStudentEmail()) {
      const author = this.authorInput.nativeElement.value;
      this.authorInput.nativeElement.value = '';
      this.authorsList.add({ name: author });
    }
  }

  deleteProject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.projectService.deleteProject(this.editedProject.id)
          .subscribe(data => {
            this.valueUtils.saveToSession(this.valueUtils.deletedProjectBoolean, true);
            this.router.navigate(['home']);
          });
      }
    });
  }
  selectionSuperUserVisibilityChange(value: Visibility) {
    this.supervisorVisibility = value;
  }

  updateProject() {
    /* Count update */
    let toUpdateCounter = 0;
    let updatedSuccessCounter = 0;
    let updatedErrorCounter = 0;
    const toAddCollaboratorsElements: InputListElement[] = [];
    const toVisibilityUpdateElements: InputListElement[] = [];
    const toRemoveCollaboratorsIds: number[] = [];

    this.userService.getCollaboratorsByProjectId(this.editedProject.id)
      .subscribe(collaborators => {
        const collaboratorsIds = collaborators.map(c => c.id);
        const authorsListIds = this.authorsList.elements.filter(e => e.id).map(e => e.id);
        collaboratorsIds.forEach(cId => {
          if (!authorsListIds.includes(cId) && !this.myselfList.elements.find(x => x.id === cId)) {
            toRemoveCollaboratorsIds.push(cId);
            toUpdateCounter++;
          }
        });
        this.authorsList.elements.forEach(element => {
          if (!element.id) {
            toAddCollaboratorsElements.push(element);
            toUpdateCounter += 2; // Add Collaborator and send email
          }
        });
        this.myselfList.elements.forEach(element => {
          toVisibilityUpdateElements.push(element);
          toUpdateCounter++;
        });
        if (this.supervisor.id === this.loggedUser.id) {
          toVisibilityUpdateElements.push({
            name: this.supervisor.firstName,
            id: this.supervisor.id,
            visibility: this.supervisorVisibility
          });
          toUpdateCounter++;
        }
        this.spinner.beginUpload(this, toUpdateCounter, '');

        /* Send update */
        toAddCollaboratorsElements.forEach(element => {
          this.userService.addCollaboratorByEmail(this.editedProject.id, element.name, element.visibility ? element.visibility : Visibility.EVERYONE)
            .subscribe(x => {
              this.spinner.addNewCollaboratorSuccess(element.name);
              updatedSuccessCounter++;
              this.emailInvitationService.send(this.editedProject.id, [element.name])
                .subscribe(sent => {
                  updatedSuccessCounter++;
                  this.spinner.addNewEmailSuccess(element.name);
                  // added collaborators + mail
                }, notSent => {
                  updatedErrorCounter++;
                  this.spinner.addNewEmailFail(element.name);
                });
            }, y => {
              updatedErrorCounter++;
              this.spinner.addNewCollaboratorFail(element.name);
            });
        });
        toRemoveCollaboratorsIds.forEach(id => {
          this.userService.removeCollaborator(this.editedProject.id, id)
            .subscribe(x => {
              updatedSuccessCounter++;
              this.spinner.removeCollaboratorSuccess(id.toString());
              // deleted collaborators
            }, y => {
              updatedErrorCounter++;
              this.spinner.removeCollaboratorFail(id.toString());
            });
        });
        toVisibilityUpdateElements.forEach(element => {
          this.userService.updateVisibility(this.editedProject.id, element.id, element.visibility)
            .subscribe(x => {
              updatedSuccessCounter++;
              this.spinner.addVisibilitySuccess(element.name);
              // visibility
            }, y => {
              this.spinner.addVisibilityFail(element.name);
              updatedErrorCounter++;
            });
        });
      });
  }

  onUpdateCompleted(updateResult: string, infoToDisplay: string, errorType: ErrorType) {
    this.spinner.setDisplay(false);
    this.updateInfo.setComponent(true, errorType, infoToDisplay);
    this.ngOnInit();
  }

  isUserSupervisor(): boolean {
    return this.isLoggedAndSupervisor;
  }

  isMyself(userId: number): boolean {
    return this.loggedUser.id === userId;
  }

}
