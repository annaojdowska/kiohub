export const SEARCH_SUPERVISORS = 'searchSupervisors';
export const SEARCH_TITLES = 'searchTitles';
export const SEARCH_TYPES = 'searchTypes';
export const SEARCH_DESC = 'searchDescriptions';
export const SEARCH_TAGS = 'searchTags';
export const SEARCH_LICENCES = 'searchLicences';
export const SEARCH_DATE_FROM = 'searchDateFrom';
export const SEARCH_DATE_TO = 'searchDateTo';
export const SEARCH_SEMESTERS = 'searchSemesters';

export const FILTER_TITLES = 'filterTitles';
export const FILTER_TYPES = 'filterTypes';
export const FILTER_TAGS = 'filterTags';
export const FILTER_STATUS = 'filterStatus';
export const FILTER_LICENCES = 'filterLicences';
export const FILTER_DATE_FROM = 'filterDateFrom';
export const FILTER_DATE_TO = 'filterDateTo';
export const FILTER_SEMESTERS = 'filterSemesters';

export class QueryDescription {

    supervisors: string[];
    tags: string[];
    titles: string[];
    descriptions: string[];
    licencesIds: number[];
    projectTypesIds: number[];
    semestersIds: number[];
    dateFrom: Date;
    dateTo: Date;
    statusesIds: number[];

    constructor() {
        this.supervisors = [];
        this.tags = [];
        this.titles = [];
        this.descriptions = [];
        this.licencesIds = [];
        this.projectTypesIds = [];
        this.semestersIds = [];
        this.statusesIds = [];
    }
}
