import { ProjectType } from './project-type.interface';
import { Licence } from './licence.interface';
import { ProjectStatus } from './project-status.interface';
import { ProjectSettings } from './project-settings.interface';
import { Tag } from './tag.interface';
import { Semester } from './semester.interface';
import { Attachment } from './attachment.interface';

export interface Project {
    id: number;
    projectType: ProjectType;
    projectStatus: ProjectStatus;
    licence: Licence;
    attachments: Attachment[];
    relatedToProjects: Project[];
    relatedFromProjects: Project[];
    projectSettings: ProjectSettings;
    tags: Tag[];
    semesters: Semester[];
    title: string;
    titleEng: string;
    description: string;
    descriptionEng: string;
    publicationDate: Date;
    published: boolean;
}
