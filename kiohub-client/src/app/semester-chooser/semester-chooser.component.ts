import { Component, OnInit, Inject, Output, EventEmitter, Input, AfterContentInit } from '@angular/core';
import { Semester } from '../model/semester.interface';
import { SemesterService } from '../services/semester-service';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-semester-chooser',
  templateUrl: './semester-chooser.component.html',
  styleUrls: ['./semester-chooser.component.css']
})
export class SemesterChooserComponent implements OnInit, AfterContentInit {
  @Output() semesterAdded = new EventEmitter<Semester>();
  @Output() semesterRemoved = new EventEmitter<Semester>();
  @Input() semestersFromParent: Semester[];
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

  ngAfterContentInit(): void {
    this.chosenSemesters = this.semestersFromParent;
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
      this.semesterRemoved.emit(chosenSemester);
    } else {
      this.chosenSemesters.push(chosenSemester);
      this.semesterAdded.emit(chosenSemester);
    }
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
