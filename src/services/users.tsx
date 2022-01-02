import { store } from '../firebaseSetup';
import { collection, getDocs, query, where } from "firebase/firestore";

import abstractService from "./abstract";
import { AbstractInterface } from "./abstractInterface";

const identifier = "users";

export interface UserInterface extends AbstractInterface {
    name: string;
    email: string;
    image: string;
    error: boolean;
    admin: boolean;
}

export default class UserService extends abstractService<UserInterface> {

    constructor() {
        super(identifier);
    }

    getByEmail = async (email: string): Promise<UserInterface> => {
        let result: UserInterface = {} as UserInterface;
        const q = query(collection(store, identifier), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            result = { id: doc.id, ...doc.data() } as UserInterface;
        });
        return result;
    }
}

