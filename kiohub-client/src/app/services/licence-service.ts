import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Licence } from '../model/licence.interface';

@Injectable()
export class LicenceService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getLicences(): Observable<Licence[]> {
    return this.http.get<Licence[]>('http://kiohub.eti.pg.gda.pl:8080/project/licences/all', {responseType: 'json'});
 }
}
