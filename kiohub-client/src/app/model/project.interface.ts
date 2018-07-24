import { Type } from './type.interface';
import { Licence } from './licence.interface';
import { Status } from './status.interface';

export interface Project {
    id: number;
    titlePL: string;
    titleENG: string;
    descriptionPL: string;
    descriptionENG: string;
    publicationDate: Date;
    isPublished: boolean;
    licence: Licence;
    type: Type;
    status: Status;
}
