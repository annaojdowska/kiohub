import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from '../../../node_modules/rxjs';
// export const address = 'http://localhost:8443';
 export const address = 'http://kiohub.eti.pg.gda.pl:8080';
// export const address = 'http://kiohub.eti.pg.gda.pl';

@Injectable()
export class ProjectService {
  projectsCache: Project[];
  cacheStatus = false;

  httpOptions = {
    headers: new HttpHeaders({
      'ContentType' : 'application/json'
    })
  };

  constructor(@Inject(HttpClient) private http: HttpClient) {
    //  this.initProjectsCache()
    //  .then(projects => { this.projectsCache = projects; this.cacheStatus = true; });
  }

  addProject(titlePl: string, collaborators: string[]) {
    const params = new HttpParams().set('titlePl', titlePl).set('collaborators', collaborators.join(', '));
    console.log(params);
    return this.http.post(address + '/project/add', params);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(address + '/project/all', { responseType: 'json' });
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
    return this.http.post<Project>(address + '/project/update/', project, this.httpOptions);
  }

  deleteProject(id: number) {
    return this.http.delete(address + '/project/delete/' +  id);
  }

//   getProjectByIdFromCache(id: number) {
//    while (this.cacheStatus !== true) { }
//    return this.projectsCache.find(project => project.id === id);
//  }

//  async initProjectsCache() {
//   return await this.getAllProjects().toPromise();
//  }
}
