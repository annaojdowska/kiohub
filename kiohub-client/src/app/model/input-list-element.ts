import { Visibility } from './visibility.enum';

export interface InputListElement {
    name: string;
    id?: number;
    file?: Blob;
    selected?: boolean;
    visibility?: Visibility;
}
