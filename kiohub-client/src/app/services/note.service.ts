import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { address } from './project.service';
import { Note } from '../model/note.interface';

const httpOptionsMultipart = {
    headers: new HttpHeaders({
        'ContentType': 'multipart/form-data'
    })
};

@Injectable()
export class NoteService {
    httpOptions = {
        headers: new HttpHeaders({
          'ContentType' : 'application/json'
        })
      };
    constructor(@Inject(HttpClient) private http: HttpClient) { }

    getNotesByProjectId(id: number): Observable<Note[]> {
        return this.http.get<Note[]>(address + '/note/project/' + id, {responseType: 'json'});
    }

    addNote(content: string, isPrivate: number, ownerId: number, projectId: number) {
        const params = new HttpParams().set('content', content).set('isPrivate', isPrivate.toString())
                                        .set('ownerId', ownerId.toString()).set('projectId', projectId.toString());
        return this.http.post<string>(address + '/note/add', params);
    }

    deleteNote(id: number) {
        return this.http.delete(address + '/note/delete/' +  id);
    }

    editNote(id: number, content: string, isPrivate: number) {
        const params = new HttpParams()
            .set('content', content)
            .set('isPrivate', isPrivate.toString());
        return this.http.post<string>(address + '/note/update/' + id, params);
    }
}
