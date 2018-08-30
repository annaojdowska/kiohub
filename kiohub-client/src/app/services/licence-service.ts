import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Licence } from '../model/licence.interface';
import { address } from './project.service';

@Injectable()
export class LicenceService {

  constructor(@Inject(HttpClient) private http: HttpClient) {
}

  getLicences(): Observable<Licence[]> {
    return this.http.get<Licence[]>(address + '/licence/all', {responseType: 'json'});
 }
}
