import { Injectable } from '@angular/core';
import { QueryDescription } from '../model/helpers/query-description.class';
import { Project } from '../model/project.interface';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { ValueUtils } from '../utils/value-utils';

@Injectable()
export class FilterService {
    valueUtils = new ValueUtils();

    filterBasedOnQuery(query: QueryDescription, projects: Project[]): Project[] {
        let projectsToFilter = projects;
        query.titles.forEach(phrase => {
            projectsToFilter = projectsToFilter
                .filter(p => p.title && p.title.toLowerCase().includes(phrase.toLowerCase()));
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.tags.forEach(tag => {
            projectsToFilter = projectsToFilter
                .filter(p => p.tags && p.tags.map(t => t.name.toLowerCase()).includes(tag.toLowerCase()));
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.licencesIds.forEach(licenceId => {
            projectsToFilter = projectsToFilter.filter(p => p.licence && p.licence.id === licenceId);
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.projectTypesIds.forEach(typeId => {
            projectsToFilter = projectsToFilter.filter(p => p.projectType && p.projectType.id === typeId);
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.statusesIds.forEach(statusId => {
            projectsToFilter = projectsToFilter.filter(p => p.projectStatus && p.projectStatus.id === statusId);
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        query.semestersIds.forEach(semesterId => {
            projectsToFilter = projectsToFilter
                .filter(p => p.semesters && p.semesters.map(semester => semester.id).includes(semesterId));
        });
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        if (!this.valueUtils.isNullOrUndefined(query.dateFrom)) {
            const date = new Date(query.dateFrom);
            projectsToFilter = projectsToFilter
                .filter(p => p.publicationDate && new Date(p.publicationDate).getTime() >= date.getTime());
        }
        if (projectsToFilter.length === 0) {
            return projectsToFilter;
        }
        if (!this.valueUtils.isNullOrUndefined(query.dateTo)) {
            const date = new Date(query.dateTo);
            projectsToFilter = projectsToFilter
                .filter(p => p.publicationDate && new Date(p.publicationDate).getTime() <= date.getTime());
        }
        return projectsToFilter;
    }
}
