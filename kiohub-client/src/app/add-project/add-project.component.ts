import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { EmailInvitationService } from '../email-invitation-service/email-invitation.service';
import { formArrayNameProvider } from '../../../node_modules/@angular/forms/src/directives/reactive_directives/form_group_name';
import { Element } from '../../../node_modules/@angular/compiler';
import { MatChipsModule } from '@angular/material/chips';



@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  constructor(
    @Inject(Router) private router: Router,
    @Inject(EmailInvitationService) private emailInvitationService: EmailInvitationService
  ) {}


  ngOnInit() {
  }

  addEmailClick(data) {
    alert('Entered Email: ' + data.newEmail);
  }




  createProjectClick(data) {
    console.log(data);
    alert('Entered Button: ' + data.title);
    // let projectTitle: string = data.title;
    const recipients: string[] = [];
    recipients.push(data.email0);
    this.emailInvitationService.send(data.title, recipients).subscribe(
      (response: any) => {
        this.router.navigateByUrl('edit-project');
      },
      error => {
        this.router.navigateByUrl('edit-project');
      }
    );
  }
}
