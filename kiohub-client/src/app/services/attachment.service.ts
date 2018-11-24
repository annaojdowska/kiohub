import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AttachmentType } from '../model/attachment-type.enum';
import { Visibility } from '../model/visibility.enum';
import { InputListComponent } from '../input-list/input-list.component';
import { Project } from '../model/project.interface';
import { address } from './project.service';

const httpOptionsMultipart = {
  headers: new HttpHeaders({
    'ContentType': 'multipart/form-data'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  httpOptions = {
    headers: new HttpHeaders({
      'ContentType': 'application/json'
    })
  };
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  upload(file: Blob, type: AttachmentType, projectId: number | string, visibility: Visibility, mainPhoto: Boolean | string) {
    const formData = new FormData();
    const attachmentTypeString = AttachmentType[type];
    formData.append('File', file);
    formData.append('Type', attachmentTypeString);
    formData.append('ProjectId', projectId.toString());
    formData.append('Visibility', visibility);
    formData.append('MainPhoto', String(mainPhoto));
    return this.http.post<string>(address + '/attachment/upload', formData, httpOptionsMultipart);
  }

  updateMetadata(projectId: number, attachmentId: number, visibility: Visibility, mainPhoto: Boolean) {
    const params = new HttpParams()
      .set('projectId', projectId.toString())
      .set('attachmentId', attachmentId.toString())
      .set('visibility', visibility.toString())
      .set('mainPhoto', mainPhoto.toString());
    return this.http.post(address + '/attachment/updateMetadata', params);
  }

  remove(projectId: number, attachments: number[]) {
    return this.http.post(address + '/attachment/remove', attachments,
      { headers: this.httpOptions.headers, params: { 'projectId': projectId.toString() } });
  }

  removeAttachments(editedProject: Project, attachmentList: InputListComponent, type: AttachmentType) {
    this.remove(editedProject.id, editedProject.attachments.filter(att => att.type === type)
      .map(att => att.id).filter(id => !attachmentList.elements.filter(el => el.id).map(el => el.id).includes(id))).subscribe(data => { },
        error => {
        });
  }

  getPhotoAttachment(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(address + '/attachment/downloadPhoto', { responseType: 'blob', params: params });
  }

  getAttachment(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(address + '/attachment/download', { responseType: 'blob', params: params });
  }

}

