import { Injectable } from '../../../node_modules/@angular/core';
import { QueryDescription } from '../model/helpers/query-description.class';
import { Project } from '../model/project.interface';
import { preserveWhitespacesDefault } from '../../../node_modules/@angular/compiler';
import { ValueUtils } from '../utils/value-utils';

@Injectable()
export class FilterService {
    valueUtils = new ValueUtils();

    filterBasedOnQuery(query: QueryDescription, projects: Project[]): Project[] {
        let projectsToFilter = projects;
        query.titles.forEach(phrase => {
            projectsToFilter = projectsToFilter.filter(p => p.title.toLowerCase().includes(phrase.toLowerCase()));
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.tags.forEach(tag => {
            projectsToFilter = projectsToFilter.filter(p => p.tags.map(t => t.name.toLowerCase()).includes(tag.toLowerCase()));
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.licencesIds.forEach(licenceId => {
            projectsToFilter = projectsToFilter.filter(p => p.licence.id === licenceId);
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.projectTypesIds.forEach(typeId => {
            projectsToFilter = projectsToFilter.filter(p => p.projectType.id === typeId);
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.statusesIds.forEach(statusId => {
            projectsToFilter = projectsToFilter.filter(p => p.projectStatus.id === statusId);
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.semestersIds.forEach(semesterId => {
            projectsToFilter = projectsToFilter.filter(p => p.semesters.map(semester => semester.id).includes(semesterId));
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        if (!this.valueUtils.isNullOrUndefined(query.dateFrom)) {
            const date = new Date(query.dateFrom);
            projectsToFilter = projectsToFilter.filter(p => new Date(p.publicationDate).getTime() >= date.getTime());
        }
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        if (!this.valueUtils.isNullOrUndefined(query.dateTo)) {
            const date = new Date(query.dateTo);
            projectsToFilter = projectsToFilter.filter(p => new Date(p.publicationDate).getTime() <= date.getTime());
        }
        return projectsToFilter;
    }
}
