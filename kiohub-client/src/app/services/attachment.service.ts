import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.http.post<string>('http://kiohub.eti.pg.gda.pl:8080/attachment/upload', formData, httpOptionsMultipart);
  }

  remove(attachments: number[]) {
    return this.http.post('http://kiohub.eti.pg.gda.pl:8080/attachment/remove', attachments, this.httpOptions);
  }

  removeAttachments(editedProject: Project, attachmentList: InputListComponent, type: AttachmentType) {
    this.remove(editedProject.attachments.filter(att => att.type === type)
      .map(att => att.id).filter(id => !attachmentList.elements.filter(el => el.id).map(el => el.id).includes(id))).subscribe(data => {},
      error => {
        console.log('ERROR: Wystąpił błąd usunięcia załącznika.');
      });
    }

  private getAttachment(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Blob>('http://localhost:8080/attachment/download', {params: params});
  }

  private downloadFile(data: Response) {
    const blob = new Blob([data], { type: 'text/csv' });
    return blob;
  }

  getAttachmentById(id: number): Blob {
    let file: Blob;
    this.getAttachment(id).subscribe(data => file = data);
    return file;
  }
}

