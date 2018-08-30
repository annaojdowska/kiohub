import { Injectable, OnInit } from '../../../node_modules/@angular/core';
import { Project } from '../model/project.interface';
import { Observable, Subject } from '../../../node_modules/rxjs';
import { address } from './project.service';

@Injectable()
export class ProjectDetailsService {
    private subject = new Subject<Project>();

    setSelectedProject(project: Project) {
        this.subject.next(project);
    }

    getSelectedProject() {
        return this.subject.asObservable();
    }
}
