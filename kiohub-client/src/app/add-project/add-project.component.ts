import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailInvitationService } from '../email-invitation-service/email-invitation.service';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.interface';
import { InputListComponent } from '../input-list/input-list.component';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  collaborators: string[];
  project: Project;

  @ViewChild('authorsList') authorsList: InputListComponent;
  @ViewChild('authorInput') authorInput: any;
  @ViewChild('titleInput') titleInput: any;
  @ViewChild('errorInput') errorInput: any;

  constructor(
    @Inject(Router) private router: Router,
    @Inject(EmailInvitationService) private emailInvitationService: EmailInvitationService,
    @Inject(ProjectService) private projectService: ProjectService,
  ) {
    this.collaborators = [];
  }

  ngOnInit() {
  }

  addAuthor(author) {
    this.authorInput.nativeElement.value = '';
    this.authorsList.add({name: author});
  }

  recieveElements($event) {
    this.collaborators = $event.map(c => c.name);
  }

  actionAddProject() {
    this.errorInput = 'tekst przykładowy';
    const title = this.titleInput.nativeElement.value;
    if (title !== '' && this.collaborators.length > 0) {
      // TODO walidacja regexem
      console.log(title);
      const httpStatus = this.projectService.getTitleUnique(title).subscribe(res => {
        if (res !== 409) {
          console.log('Dodaję projekt.');
          const httpStatus2 = this.projectService.addProject(title, this.collaborators).subscribe((data: Project) => {
            this.project = data;
            console.log(this.project);
          });
        } else {
          console.log('Istnieje już projekt o takim projekcie.');
        }
      });
      this.sendInvitations(title, this.collaborators);
    } else {
      console.log('Podaj tytuł oraz co najmniej jednego współpracownika.');
    }
  }

  sendInvitations(title, collaborators) {
    this.emailInvitationService.send(title, this.collaborators)
    .subscribe(
      (response: any) => {
        this.router.navigateByUrl('edit-project');
      },
      error => {
        this.router.navigateByUrl('edit-project');
      }
    );
  }
}
