import { Visibility } from './visibility.enum';

export interface ProjectCollaborator {
    userId: number;
    projectId: number;
    userDataVisible: Visibility;
    isSupervisor: Boolean;
}
