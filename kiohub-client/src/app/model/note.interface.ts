export interface Note {
    id: number;
    content: string;
    publicationDate: Date;
    isPrivate: number;
    ownerId: number;
    projectId: number;
}
