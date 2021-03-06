import { Injectable, OnInit } from '@angular/core';
import { Project } from '../model/project.interface';
import { Observable, Subject } from 'rxjs';

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
