import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Semester } from '../model/semester.interface';

@Injectable()
export class SemesterService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getSemesters(): Observable<Semester[]> {
     return this.http.get<Semester[]>('http://kiohub.eti.pg.gda.pl:8080/project/semesters/all', {responseType: 'json'});
  }
}
