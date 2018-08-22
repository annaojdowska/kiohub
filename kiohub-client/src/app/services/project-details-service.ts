import { Injectable } from '../../../node_modules/@angular/core';
import { Project } from '../model/project.interface';
import { Observable, Subject } from '../../../node_modules/rxjs';

@Injectable()
export class ProjectDetailsService {
    private subject = new Subject<Project>();
    currentProject: Project;

    setSelectedProject(project: Project) {
        this.currentProject = project;
        this.subject.next(project);
    }

    getSelectedProject() {
        return this.subject.asObservable();
    }
}
