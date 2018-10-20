import { Injectable } from '../../../node_modules/@angular/core';
import { QueryDescription } from '../model/helpers/query-description.class';
import { Project } from '../model/project.interface';

@Injectable()
export class FilterService {

    filterBasedOnQuery(query: QueryDescription, projects: Project[]): Project[] {
        return projects;
    }
}
