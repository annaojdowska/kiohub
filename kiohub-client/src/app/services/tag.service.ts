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
    address = 'http://localhost:8443';
    // address = 'http://kiohub.eti.pg.gda.pl:8080';
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>('http://localhost:8443/tag/all', {responseType: 'json'});
 }

 addTags(projectId: number, tags: string[]) {
    const params = new HttpParams().set('projectId', projectId.toString()).set('tags', tags.join(', '));
    return this.http.post(this.address + '/tag/add', params);
  }
}
