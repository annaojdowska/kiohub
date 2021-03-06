import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from 'rxjs';
// export const address = 'http://localhost:8080';
// export const address = 'http://kiohub.eti.pg.gda.pl:8080';
   export const address = 'http://kiohub.eti.pg.gda.pl';

@Injectable()
export class ProjectService {
  projectsCache: Project[];
  cacheStatus = false;

  httpOptions = {
    headers: new HttpHeaders({
      'ContentType' : 'application/json'
    })
  };

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  addProject(titlePl: string, collaborators: string[]) {
    const params = new HttpParams().set('titlePl', titlePl).set('collaborators', collaborators.join(', '));
    return this.http.post(address + '/project/add', params);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(address + '/project/all', { responseType: 'json' });
  }

  getPublishedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(address + '/project/published', { responseType: 'json' });
  }

  getTitleUnique(titlePl: string) {
    const params = new HttpParams().set('titlePl', titlePl);
    return this.http.get(address + '/project/checkTitleUniqueness',
      { responseType: 'json', params: params });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(address + '/project/' + id, {responseType: 'json'});
  }

  updateProject(project: Project) {
    return this.http.post<Project>(address + '/project/update/', project,
    {headers: this.httpOptions.headers, params: {'projectId' : project.id.toString()}});
  }

  deleteProject(id: number) {
    return this.http.delete(address + '/project/delete/' +  id);
  }

  publishProject(id: number) {
    return this.http.post<Project>(address + '/project/publish/' + id, this.httpOptions);
  }

  unpublishProject(id: number): any {
    return this.http.post<Project>(address + '/project/unpublish/' + id, this.httpOptions);
  }

  getProjectsByCollaboratorId(id: number): Observable<Project[]> {
    return this.http.get<Project[]>(address + '/collaborator/project/byCollaborator/' + id, {responseType: 'json'});
  }

  getRelatedProjects(id: number): Observable<Project[]> {
    return this.http.get<Project[]>(address + '/project/relatedTo/' + id, {responseType: 'json'});
  }

  setRelatedProjects(id: number, relatedProjects: Project[]) {
    return this.http.post<Project>(address + '/project/set-related/' + id , relatedProjects, this.httpOptions);
  }

  isProjectPublishedOrUserIsCollaborator(projectId: number) {
    const params = new HttpParams()
    .set('projectId', projectId.toString());
    return this.http.post<boolean>(address + '/security/isProjectPublishedOrUserIsCollaborator', params, this.httpOptions);
  }
}
