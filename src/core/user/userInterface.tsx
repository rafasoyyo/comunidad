import {AbstractInterface, AddressInterface} from '../interfaces';
import {User} from 'firebase/auth';

export interface UserData extends AbstractInterface {
    name?: string;
    email: string;
    address?: AddressInterface[];
    admin?: {
        role: 'admin' | 'user';
        verified: boolean;
    };
}

export default interface UserInterface {
    auth: User;
    data: UserData;
}
