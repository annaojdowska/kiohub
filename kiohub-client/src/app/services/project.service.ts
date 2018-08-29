import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class ProjectService {
  httpOptions = {
    headers: new HttpHeaders({
      'ContentType' : 'application/json'
    })
  };
  address: string;
  projectsCache: Project[];
  cacheStatus = false;
  constructor(@Inject(HttpClient) private http: HttpClient) {
    // this.address = 'http://localhost:8443';
     this.address = 'http://kiohub.eti.pg.gda.pl:8080';
    //  this.initProjectsCache()
    //  .then(projects => { this.projectsCache = projects; this.cacheStatus = true; });
  }

  addProject(titlePl: string, collaborators: string[]) {
    const params = new HttpParams().set('titlePl', titlePl).set('collaborators', collaborators.join(', '));
    console.log(params);
    return this.http.post(this.address + '/project/add', params);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.address + '/project/all', { responseType: 'json' });
  }

  getTitleUnique(titlePl: string) {
    const params = new HttpParams().set('titlePl', titlePl);
    return this.http.get(this.address + '/project/checkTitleUniqueness',
      { responseType: 'json', params: params });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(this.address + '/project/' + id, {responseType: 'json'});
  }

  updateProject(project: Project) {
    return this.http.post<Project>(this.address + '/project/update/', project, this.httpOptions);
 }

//   getProjectByIdFromCache(id: number) {
//    while (this.cacheStatus !== true) { }
//    return this.projectsCache.find(project => project.id === id);
//  }

//  async initProjectsCache() {
//   return await this.getAllProjects().toPromise();
//  }
}
