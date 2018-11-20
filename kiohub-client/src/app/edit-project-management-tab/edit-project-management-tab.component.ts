import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.interface';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { InputListComponent } from '../input-list/input-list.component';
import { UserEmail } from '../model/user-email.interface';
import { Visibility } from '../model/visibility.enum';
import { ProjectCollaborator } from '../model/project-collaborator';
import { Validation } from '../utils/validation-patterns';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { EmailInvitationService } from '../email-invitation-service/email-invitation.service';
import { InputListElement } from '../model/input-list-element';
import { ValueUtils } from '../utils/value-utils';
import { ProjectManagementSpinnerComponent } from '../ui-elements/spinner/project-management-spinner/project-management-spinner.component';
import { MatDialogConfig, MatDialog } from '../../../node_modules/@angular/material';
import { DeleteDialogComponent } from '../ui-elements/delete-dialog/delete-dialog.component';
import { ErrorType } from '../error-info/error-type.enum';

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
    this.collaborators = [];
    this.userService.getCurrentUser().subscribe(user => this.loggedUser = user);
    const projectId = this.getProjectIdFromRouter();
    this.projectService.getProjectById(projectId).subscribe(result => {
      this.editedProject = result;
      this.userService.getCollaboratorsByProjectId(projectId).subscribe(c => {
        this.collaborators = c.filter(coll => coll.email.includes(this.STUDENT_EMAIL_PATTERN));
        this.userService.getCollaboratorsDataByProjectId(projectId).subscribe(pc => {
          this.collaborators.forEach(coll => {
            console.log('ProjeCollab ' + pc.length + ' ' + pc[0].userDataVisible);
            console.log(coll.id);
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
      this.userService.getSupervisorByProjectId(projectId).subscribe(s => this.supervisor = s);
      this.userService.getSupervisorDataByProjectId(projectId).subscribe(sd => {
        if (sd && sd.userDataVisible) {
          this.supervisorVisibility = sd.userDataVisible;
        } else {
          this.supervisorVisibility = Visibility.EVERYONE;
        }
      });
    });
    this.userService.isLoggedAndSupervisor().subscribe(result => this.isLoggedAndSupervisor = result);
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
        console.log('authors list in update ' + this.authorsList);
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

        console.log('elementów do zapisu: ' + toUpdateCounter);
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
                  // dodani współpracownicy + mail
                  // TODO dodano
                }, notSent => {
                  updatedErrorCounter++;
                  this.spinner.addNewEmailFail(element.name);
                  // TODO nie dodano
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
              this.spinner.removeCollaboratorSuccess(id.toString()); // ??
              // usunięci współpracownicy
              // TODO DODANO
            }, y => {
              updatedErrorCounter++;
              this.spinner.removeCollaboratorFail(id.toString()); // ??
              // TODO nie dodano
            });
        });
        toVisibilityUpdateElements.forEach(element => {
          this.userService.updateVisibility(this.editedProject.id, element.id, element.visibility)
            .subscribe(x => {
              updatedSuccessCounter++;
              this.spinner.addVisibilitySuccess(element.name);
              // widoczność
              // TODO dodano
            }, y => {
              this.spinner.addVisibilityFail(element.name);
              updatedErrorCounter++;
              // TODO nie dodano
            });
        });
      }, error => {
        // TODO obsłużyć błąd i wyświetlić!
      });
    }

  onUpdateCompleted(updateResult: string, infoToDisplay: string, errorType: ErrorType) {
    // TODO zapisać zmiany do sesji
    // odświeżyć
    console.log('zakończono update! ' + updateResult);
    this.spinner.setDisplay(false);
    this.updateInfo.setComponent(true, errorType, infoToDisplay);
    this.ngOnInit();
    // window.location.reload();
  }

  isUserSupervisor(): boolean {
    return this.isLoggedAndSupervisor; // testy: true
  }

  isMyself(userId: number): boolean {
    return this.loggedUser.id === userId; // testy: true
  }

}
