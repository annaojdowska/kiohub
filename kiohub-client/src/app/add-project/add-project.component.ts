import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailInvitationService } from '../email-invitation-service/email-invitation.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  recipients: string[];

  @ViewChild('authorsList') authorsList: any;
  @ViewChild('authorInput') authorInput: any;
  @ViewChild('titleInput') titleInput: any;

  constructor(
    @Inject(Router) private router: Router,
    @Inject(EmailInvitationService) private emailInvitationService: EmailInvitationService
  ) {}

  ngOnInit() {
  }

  addAuthor(author) {
    this.authorInput.nativeElement.value = '';
    this.authorsList.add(author);
  }

  recieveElements($event) {
    this.recipients = $event;
  }

  createProjectClick() {
    const title = this.titleInput.nativeElement.value;
    console.log(title);
    alert('Tytuł: ' + title + '\n' + 'Odbiorcy: ' + this.recipients);
    // let projectTitle: string = data.title;
    this.emailInvitationService.send(title, this.recipients).subscribe(
      (response: any) => {
        this.router.navigateByUrl('edit-project');
      },
      error => {
        this.router.navigateByUrl('edit-project');
      }
    );
  }
}
