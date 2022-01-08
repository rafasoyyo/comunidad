import {Timestamp} from 'firebase/firestore';

export default interface AbstractInterface {
    id?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}
