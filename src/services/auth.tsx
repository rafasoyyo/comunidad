import { auth } from "../firebaseSetup";
import {
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    User,
    UserCredential
} from "firebase/auth";
import { ErrorInterface } from "../services/abstractInterface";
import UserService, { UserInterface } from "../services/users";
import { createContext } from "react";
const userService = new UserService();

export type { User };
export const UserContext = createContext({} as UserInterface);

/**
 * Save current logged customer on memory
 */
export const current = {
    value: {} as UserInterface,
    set: async (customer: User): Promise<void>  => {
        current.value = await userService.getByEmail(customer.providerData[0].email || '');
    },
    get: (): UserInterface => current.value,
    getId: (): string => current.get().id,
}

export default class AuthService {

    /**
     * Create a new user with email and password
     * @param email User email
     * @param password User password
     * @returns User if found, error if not
     */
    createUser = async (email: string, password?: string): Promise<User | ErrorInterface> => {
        let result: User | ErrorInterface;
        try {
            await setPersistence(auth, browserSessionPersistence);
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password || userService.generateUID());
            const newUser = { id: userCredential.user.uid, email: email, name: email, admin: false } as UserInterface
            await userService.edit(newUser) ;
            current.set(userCredential.user);
            result = userCredential.user;
        } catch (e: any) {
            result = { error: true, errorMsg: e.message };
        }
        return result;
    };

    /**
     * Login a user with email and password
     * @param email User email
     * @param password User password
     * @returns User if found, error if not
     */
    loginUser = async (email: string, password: string): Promise<User | ErrorInterface> => {
        let result: User | ErrorInterface;
        try {
            await setPersistence(auth, browserSessionPersistence);
            const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
            current.set(userCredential.user);
            result = userCredential.user;
        } catch (e: any) {
            result = { error: true, errorMsg: e.message };
        }
        return result;
    };

    /**
     * Logout a user
     * @returns void
     */
    logoutUser = async (): Promise<void> => {
        return signOut(auth);
    };

    /**
     * Check if user is logged in
     * @returns User if found, false if not
     */
    getAuthState = async (): Promise<any> => {
        return new Promise((resolve, reject) => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    current.set(user as User);
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    }
}
