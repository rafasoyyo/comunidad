import { Timestamp } from "firebase/firestore";

export interface ErrorInterface {
    error: boolean;
    errorMsg: string;
}

export interface AbstractInterface {
    id: string;
    error: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}