import { Component, OnInit, Inject } from '@angular/core';
import { Semester } from '../model/semester.interface';
import { SemesterService } from '../services/semester-service';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-semester-chooser',
  templateUrl: './semester-chooser.component.html',
  styleUrls: ['./semester-chooser.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ]),
      ]
    )
  ],
})
export class SemesterChooserComponent implements OnInit {
  semesters: Semester[];
  chosenSemesters: Semester[];
  pageScope = 12;
  beginIndex = 4 * 12;
  endIndex = this.beginIndex + this.pageScope;
  pathToLeftArrow = '../../assets/left-arrow.png';
  pathToRightArrow = '../../assets/right-arrow.png';

  constructor(@Inject(SemesterService) private semesterService: SemesterService)  {
    this.chosenSemesters = [];
    this.semesters = [];
   }

  ngOnInit() {
    this.semesterService.getSemesters().subscribe(result => this.semesters = result);
  }

  getSemestersToDisplay(begin: number, end: number) {
    if (!this.semesters) { return; }
    return this.semesters.slice(begin, end);
  }

  moveToNext() {
    this.beginIndex += this.pageScope;
    this.endIndex += this.pageScope;
  }
  moveToPrevious() {
    this.beginIndex -= this.pageScope;
    this.endIndex -= this.pageScope;
  }

  chooseSemester(chosenSemester: Semester) {
    const index = this.chosenSemesters.findIndex(sem => sem.id === chosenSemester.id);
    if (index !== -1) {
      this.chosenSemesters.splice(index, 1);
    } else {
      this.chosenSemesters.push(chosenSemester);
    }
    console.log(this.chosenSemesters);
  }

  getColor(chosenSemester: Semester) {
    const index = this.chosenSemesters.findIndex(sem => sem.id === chosenSemester.id);
    if (index !== -1) {
      return 'rgb(208, 211, 233)';
    } else {
      return 'whitesmoke';
    }
  }
}
