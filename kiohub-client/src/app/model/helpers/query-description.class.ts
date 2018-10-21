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
