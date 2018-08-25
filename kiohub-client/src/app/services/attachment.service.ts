import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AttachmentType } from '../model/attachment-type.enum';
import { Visibility } from '../model/visibility.enum';

const httpOptionsMultipart = {
  headers: new HttpHeaders({
    'ContentType' : 'multipart/form-data'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  upload(file: Blob, type: AttachmentType, projectId: number | string, visibility: Visibility, mainPhoto: boolean | string) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Type', AttachmentType.THESIS);
    formData.append('ProjectId', projectId.toString());
    formData.append('Visibility', Visibility.EVERYONE);
    formData.append('MainPhoto', String(mainPhoto));
    return this.http.post<string>('http://kiohub.eti.pg.gda.pl:8080/attachment/upload', formData, httpOptionsMultipart);
  }
}

