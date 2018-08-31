import { Project } from './project.interface';
import { AttachmentType } from './attachment-type.enum';

export interface Attachment {
    id: number;
    project: Project;
    fileName: string;
    fileSize: number;
    type: AttachmentType;
    visibility: string;
    mainPhoto: Boolean;
}
