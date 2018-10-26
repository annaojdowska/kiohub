import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailInvitationService } from '../email-invitation-service/email-invitation.service';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.interface';
import { InputListComponent } from '../input-list/input-list.component';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { Validation } from '../utils/validation-patterns';
import { LoginService } from '../services/login.service';
import { ValueUtils } from '../utils/value-utils';
import { SpinnerComponent } from '../ui-elements/spinner/spinner.component';
import { ErrorType } from '../error-info/error-type.enum';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  SENDING_INVITATIONS_OK = true;

  project: Project;
  validation: Validation = new Validation();
  valueUtils = new ValueUtils();

  @ViewChild('authorsList') authorsList: InputListComponent;
  @ViewChild('authorInput') authorInput: any;
  @ViewChild('titleInput') titleInput: any;
  @ViewChild('errorInput') errorInput: any;
  @ViewChild('titlePlError') titlePlError: ErrorInfoComponent;
  @ViewChild('emailError') emailError: ErrorInfoComponent;
  @ViewChild('emailsError') emailsError: ErrorInfoComponent;
  @ViewChild('errorInfo') errorInfo: ErrorInfoComponent;
  @ViewChild('spinner') spinner: SpinnerComponent;

  constructor(
    @Inject(Router) private router: Router,
    @Inject(EmailInvitationService) private emailInvitationService: EmailInvitationService,
    @Inject(LoginService) private loginService: LoginService,
    @Inject(ProjectService) private projectService: ProjectService,
  ) { }

  ngOnInit() {
  }

  // ******** GETTERS ********
  getTitlePlPattern() {
    return this.validation.getTitlePattern();
  }

  // ******** CHECK VALIDITY ********
  checkValidityTitle() {
    return this.validation.validate(this.titlePlError, this.validation.validateTitlePl(this.titleInput));
  }

  checkValidityStudentEmail() {
    return this.validation.validate(this.emailError, this.validation.validateStudentPGEmail(this.authorInput));
  }

  checkValidityStudentsEmails() {
    return this.validation.validate(this.emailsError, this.validation.validateListOfStudentsEmails(this.authorsList));
  }

  // ******** FUNCTION CALLED WHEN ELEMENT'S VALUE CHANGES ********
  onTitlePlChange(event) {
    this.checkValidityTitle();
  }

  onEmailsChange(event) {
    this.emailsError.setDisplay(false);
  }

  addAuthor() {
    if (this.checkValidityStudentEmail()) {
      const author = this.authorInput.nativeElement.value;
      this.authorInput.nativeElement.value = '';
      this.authorsList.add({ name: author });
    }
  }

  validateAllElements() {
    let validationOk;
    validationOk = this.checkValidityTitle() && this.checkValidityStudentsEmails();
    if (this.checkValidityStudentsEmails()) {
      this.emailError.setDisplay(false);
    }
    return validationOk;
  }

  actionAddProject() {
    this.errorInput = 'tekst przykładowy';
    const title = this.titleInput.nativeElement.value;
    if (this.validateAllElements()) {
      console.log(title);
      // console.log('Próbuję dodać projekt.');
      // const httpStatus = this.projectService.getTitleUnique(title).subscribe(res => {
      //   if (res !== 409) {
      console.log('Dodaję projekt.');
      const httpStatus2 = this.projectService.addProject(title, this.authorsList.elements.map(e => e.name))
        .subscribe((data: Project) => {
          this.errorInfo.setDisplay(false);
          this.spinner.showSpinner('Proszę czekać. Trwa dodawanie projektu oraz wysyłanie zaproszeń do studentów.');
          this.project = data;
          console.log(this.project);
          this.sendInvitationsAndRedirect(title, this.authorsList.elements.map(e => e.name));
          this.emailError.setDisplay(false);
        },
        error => {
          this.errorInfo.setDisplay(true);
        });
      // } else {
      //   console.log('ERROR: Istnieje już projekt o takim projekcie.');
      // }
      // });
    }
  }

  sendInvitationsAndRedirect(title, collaborators: string[]) {
    console.log(this.project);

    this.emailInvitationService.send(title, collaborators)
      .subscribe(
        (response: any) => {
          this.valueUtils.saveToSession(this.valueUtils.invitationsOk, true);
          console.log('udało się wysłać zaproszenia');
          this.router.navigate(['/edit-project', this.project.id]);
        },
        error => {
          this.valueUtils.saveToSession(this.valueUtils.invitationsOk, false);
          console.log('nie udało się wysłać zaproszeń :(');
          this.router.navigate(['/edit-project', this.project.id]);
        }
      );
  }
}
