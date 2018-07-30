import { Project } from './project.interface';

export interface Semester {
    id: number;
    name: string;
    projects: Project[];
}
