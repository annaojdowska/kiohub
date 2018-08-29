import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AttachmentType } from '../model/attachment-type.enum';
import { Visibility } from '../model/visibility.enum';
import { InputListComponent } from '../input-list/input-list.component';
import { Project } from '../model/project.interface';

const httpOptionsMultipart = {
  headers: new HttpHeaders({
    'ContentType' : 'multipart/form-data'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  httpOptions = {
    headers: new HttpHeaders({
      'ContentType' : 'application/json'
    })
  };
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  upload(file: Blob, type: AttachmentType, projectId: number | string, visibility: Visibility, mainPhoto: boolean | string) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Type', type);
    formData.append('ProjectId', projectId.toString());
    formData.append('Visibility', visibility);
    formData.append('MainPhoto', String(mainPhoto));
    return this.http.post<string>('http://kiohub.pg.gda.pl:8080/attachment/upload', formData, httpOptionsMultipart);
  }

  remove(attachments: number[]) {
    return this.http.post('http://kiohub.pg.gda.pl:8080/attachment/remove', attachments, this.httpOptions);
  }

  removeAttachments(editedProject: Project, attachmentList: InputListComponent, type: AttachmentType) {
    this.remove(editedProject.attachments.filter(att => att.type === type)
      .map(att => att.id).filter(id => !attachmentList.elements.filter(el => el.id).map(el => el.id).includes(id))).subscribe(data => {},
      error => {
        console.log('ERROR: Wystąpił błąd usunięcia załącznika.');
      });
    }
}

