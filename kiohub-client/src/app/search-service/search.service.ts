import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SearchService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  search(query: string) {
     return this.http.get('http://kiohub.eti.pg.gda.pl/project/all');
  }
}
