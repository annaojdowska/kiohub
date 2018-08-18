import { Project } from './project.interface';

export interface Attachment {
    id: number;
    project: Project;
    fileName: string;
    fileSize: number;
    type: string;
    visibility: string;
    mainPhoto: Boolean;
}
