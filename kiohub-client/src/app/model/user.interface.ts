import { UserEmail } from './user-email.interface';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    emails: UserEmail[];
}
