import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../model/tag.interface';
import { address } from './project.service';

@Injectable()
export class TagService {
    httpOptions = {
        headers: new HttpHeaders({
          'ContentType' : 'application/json'
        })
      };
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(address + '/tag/all', {responseType: 'json'});
 }
}
