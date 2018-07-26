import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  constructor(@Inject(Router) private router: Router) { }

  ngOnInit() {
  }

  onClickSubmit(data) {
    alert('Entered Email: ' + data.email);
  }

  btnClick = function () {
    this.router.navigateByUrl('edit-project');
  };
}
