import { Project } from '../project.interface';

export class SearchResult {
    score: number;
    project: Project;

    constructor(project: Project, score: number) {
        this.project = project;
        this.score = score;
    }
}
