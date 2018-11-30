import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Semester } from '../model/semester.class';
import { address } from './project.service';

@Injectable()
export class SemesterService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getSemesters(): Observable<Semester[]> {
     return this.http.get<Semester[]>(address + '/semester/all', {responseType: 'json'});
  }
}
