import { ProjectType } from './project-type.interface';
import { Licence } from './licence.interface';
import { ProjectStatus } from './project-status.interface';
import { Tag } from './tag.interface';
import { Semester } from './semester.class';
import { Attachment } from './attachment.interface';

export interface Project {
    id: number;
    projectType: ProjectType;
    projectStatus: ProjectStatus;
    licence: Licence;
    attachments: Attachment[];
    relatedToProjects: Project[];
    tags: Tag[];
    semesters: Semester[];
    title: string;
    titleEng: string;
    description: string;
    descriptionEng: string;
    publicationDate: Date;
    published: boolean;
}
