import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectCollaborator } from '../model/project-collaborator';
import { UserEmail } from '../model/user-email.interface';
import { User } from '../model/user.interface';
import { Visibility } from '../model/visibility.enum';
import { address } from './project.service';

@Injectable()
export class UserService {

private currentUser: User;
constructor(@Inject(HttpClient) private http: HttpClient) { }

    getCurrentUser(): Observable<User> {
      return this.http.get<User>(address + '/login/getLogged', {responseType: 'json'});
    }

    isLogged(): Observable<boolean> {
        return this.http.get<boolean>(address + '/login/isLogged', {responseType: 'json'});
    }

    isLoggedAndSupervisor(): Observable<boolean> {
      return this.http.get<boolean>(address + '/login/isSupervisor', {responseType: 'json'});
    }

    getCollaboratorsByProjectId(id: number): Observable<UserEmail[]> {
        return this.http.get<UserEmail[]>(address + '/collaborator/project/' + id, {responseType: 'json'});
     }

    getSupervisorByProjectId(id: number): Observable<User> {
        return this.http.get<User>(address + '/collaborator/supervisor/project/' + id, {responseType: 'json'});
     }

     getCollaboratorsDataByProjectId(id: number): Observable<ProjectCollaborator[]> {
        return this.http.get<ProjectCollaborator[]>(address + '/collaborator/data/project/' + id, {responseType: 'json'});
     }

    getSupervisorDataByProjectId(id: number): Observable<ProjectCollaborator> {
        return this.http.get<ProjectCollaborator>(address + '/collaborator/data/supervisor/project/' + id, {responseType: 'json'});
     }

    getUserById(id: number, projectId: number): Observable<User> {
        const params = new HttpParams()
          .set('projectId', projectId.toString());
        return this.http.get<User>(address + '/user/' + id, {responseType: 'json', params: params});
     }

     updateVisibility(projectId: number, userId: number, visibility: Visibility) {
        const params = new HttpParams()
          .set('projectId', projectId.toString())
          .set('userId', userId.toString())
          .set('visibility', visibility.toString());
        return this.http.post(address + '/collaborator/updateVisibility', params);
      }

      addCollaboratorByEmail(projectId: number, email: string, visibility: Visibility) {
        const params = new HttpParams()
        .set('projectId', projectId.toString())
        .set('visibility', visibility.toString())
        .set('email', email);
        return this.http.post(address + '/collaborator/add', params);
      }

      removeCollaborator(projectId: number, collaboratorId: number) {
        const params = new HttpParams()
          .set('projectId', projectId.toString())
          .set('collaboratorId', collaboratorId.toString());
        return this.http.post(address + '/collaborator/remove', params);
      }

      loggedIsCollaborator(projectId: number): Observable<Boolean> {
        return this.http.get<Boolean>(address + '/collaborator/loggedis/' + projectId, {responseType: 'json'});
      }
}
