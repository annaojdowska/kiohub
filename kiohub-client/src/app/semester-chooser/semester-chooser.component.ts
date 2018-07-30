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
  pageScope = 12;
  beginIndex = 0;
  endIndex = this.beginIndex + this.pageScope;
  numberOfPages = 51;
  pathToLeftArrow = '../../assets/left-arrow.png';
  pathToRightArrow = '../../assets/right-arrow.png';
  page = 0;

  constructor(@Inject(SemesterService) private semesterService: SemesterService)  { }

  ngOnInit() {
    this.semesterService.getSemesters().subscribe(result => this.semesters = result);
  }

  getSemestersToDisplay(begin: number, end: number) {
    return this.semesters.slice(begin, end);
  }

  moveToNext() {
    this.beginIndex += this.pageScope;
    this.endIndex += this.pageScope;
    this.page += 1;
    console.log(this.page);
  }
  moveToPrevious() {
    this.beginIndex -= this.pageScope;
    this.endIndex -= this.pageScope;
  }
}
