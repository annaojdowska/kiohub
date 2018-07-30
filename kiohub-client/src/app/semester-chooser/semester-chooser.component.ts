import { Component, OnInit, Inject } from '@angular/core';
import { Semester } from '../model/semester.interface';
import { SemesterService } from './semester-service';


@Component({
  selector: 'app-semester-chooser',
  templateUrl: './semester-chooser.component.html',
  styleUrls: ['./semester-chooser.component.css']
})
export class SemesterChooserComponent implements OnInit {
  semesters: Semester[];
  constructor(@Inject(SemesterService) private semesterService: SemesterService)  { }

  ngOnInit() {
    this.semesterService.getSemesters().subscribe(result => this.semesters = result);
  }

}
