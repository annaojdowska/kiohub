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
  chosenSemesters: Semester[];
  pageScope = 12;
  beginIndex = 0;
  endIndex = this.beginIndex + this.pageScope;
  pathToLeftArrow = '../../assets/left-arrow.png';
  pathToRightArrow = '../../assets/right-arrow.png';

  constructor(@Inject(SemesterService) private semesterService: SemesterService)  {
    this.chosenSemesters = [];
   }

  ngOnInit() {
    this.semesterService.getSemesters().subscribe(result => this.semesters = result);
  }

  getSemestersToDisplay(begin: number, end: number) {
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
      return 'bisque';
    } else {
      return 'white';
    }
  }
}
