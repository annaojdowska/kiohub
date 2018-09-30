import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailInvitationService } from '../email-invitation-service/email-invitation.service';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.interface';
import { InputListComponent } from '../input-list/input-list.component';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { Validation } from '../error-info/validation-patterns';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  SENDING_INVITATIONS_OK = true;

  project: Project;
  validation: Validation = new Validation();

  @ViewChild('authorsList') authorsList: InputListComponent;
  @ViewChild('authorInput') authorInput: any;
  @ViewChild('titleInput') titleInput: any;
  @ViewChild('errorInput') errorInput: any;
  @ViewChild('titlePlError') titlePlError: ErrorInfoComponent;
  @ViewChild('emailError') emailError: ErrorInfoComponent;

  constructor(
    @Inject(Router) private router: Router,
    @Inject(EmailInvitationService) private emailInvitationService: EmailInvitationService,
    @Inject(ProjectService) private projectService: ProjectService,
  ) { }

  ngOnInit() {
  }

  // ******** GETTERS ********
  getTitlePlPattern() {
    return this.validation.getTitlePattern();
  }

  getStudentEmailPattern() {
    return this.validation.getStudentEmailPattern();
  }

  // ******** CHECK VALIDITY ********
  checkValidityTitle() {
    return this.validation.validate(this.titlePlError, this.validation.validateTitlePl(this.titleInput));
  }

  checkValidityEmail() {
    return this.validation.validate(this.emailError, this.validation.validateStudentEmail(this.authorInput));
  }

  // ******** FUNCTION CALLED WHEN ELEMENT'S VALUE CHANGES ********
  onTitlePlChange(event) {
    this.checkValidityTitle();
  }

  // validates email after user presses enter
  onEmailChange(event) {
    this.checkValidityEmail();
    if (this.validation.isNullOrEmpty(event)) {
      this.emailError.setDisplay(false);
    }
  }

  addAuthor() {
    if (this.checkValidityEmail()) {
      const author = this.authorInput.nativeElement.value;
      this.authorInput.nativeElement.value = '';
      this.authorsList.add({ name: author });
    }
  }

  validateAllElements() {
    let validationOk = true;
    validationOk = this.checkValidityTitle() && validationOk;

    return validationOk;
  }

  actionAddProject() {
    this.errorInput = 'tekst przykładowy';
    const title = this.titleInput.nativeElement.value;

    if (this.validateAllElements() && this.authorsList.elements.length > 0) {
      console.log(title);
      // console.log('Próbuję dodać projekt.');
      // const httpStatus = this.projectService.getTitleUnique(title).subscribe(res => {
      //   if (res !== 409) {
      console.log('Dodaję projekt.');
      const httpStatus2 = this.projectService.addProject(title, this.authorsList.elements.map(e => e.name))
        .subscribe((data: Project) => {
          this.project = data;
          console.log(this.project);
          this.sendInvitationsAndRedirect(title, this.authorsList.elements.map(e => e.name));
          this.emailError.setDisplay(false);
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
          console.log('id' + this.project.id);
          this.router.navigate(['/edit-project', this.project.id, { invitationsOk: this.SENDING_INVITATIONS_OK }]);
        },
        error => {
          console.log('error; id' + this.project.id);
          this.router.navigate(['/edit-project', this.project.id, { invitationsOk: !this.SENDING_INVITATIONS_OK }]);
        }
      );
  }
}
