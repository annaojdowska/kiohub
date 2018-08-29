import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../model/tag.interface';
@Injectable()
export class TagService {
    httpOptions = {
        headers: new HttpHeaders({
          'ContentType' : 'application/json'
        })
      };
  //  address = 'http://localhost:8443';
    address = 'http://kiohub.eti.pg.gda.pl:8080';
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.address + '/tag/all', {responseType: 'json'});
 }
}
