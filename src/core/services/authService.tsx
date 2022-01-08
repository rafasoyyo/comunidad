import {auth} from '../../firebaseSetup';
import {
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    User,
    UserCredential,
    updateProfile
} from 'firebase/auth';

import {ErrorInterface, UserData} from '../interfaces';
import UserClass from '../user/userClass';
import {UserService} from '../services';

export default class AuthService {
    private userService = new UserService();

    /**
     * Add user data from firestore to user credential from auth
     * @param userCredential user credential from firebase
     * @returns userClass
     */
    private getUserClass = async (user: User): Promise<UserClass> => {
        const userData = (await this.userService.get(user.uid)) as unknown as UserData;
        const userClass = new UserClass(user, userData);
        return userClass;
    };

    /**
     * Create a new user with email and password
     * @param email User email∆
     * @param password User password
     * @returns User if found, error if not
     */
    createUser = async (
        name: string,
        email: string,
        password: string
    ): Promise<UserClass | ErrorInterface> => {
        let result: UserClass | ErrorInterface;
        try {
            await setPersistence(auth, browserSessionPersistence);
            const userCredential: UserCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            await this.updateUserName(user, name);
            (await this.userService.edit({id: user.uid, email})) as UserData;
            const userClass = await this.getUserClass(user);
            result = userClass as UserClass;
        } catch (e: any) {
            result = {
                error: true,
                msg: e.message,
                code: e.code.replace(/[\W]/g, '_')
            } as ErrorInterface;
        }
        return result;
    };

    /**
     * Login a user with email and password
     * @param email User email
     * @param password User password
     * @returns User if found, error if not
     */
    loginUser = async (email: string, password: string): Promise<UserClass | ErrorInterface> => {
        let result: UserClass | ErrorInterface;
        try {
            await setPersistence(auth, browserSessionPersistence);
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const userClass = await this.getUserClass(userCredential.user);
            result = userClass as UserClass;
        } catch (e: any) {
            result = {
                error: true,
                msg: e.message,
                code: e.code.replace(/[\W]/g, '_')
            } as ErrorInterface;
        }
        return result;
    };

    /**
     * Logout a user
     * @returns void
     */
    logoutUser = async (): Promise<void | ErrorInterface> => {
        let result: void | ErrorInterface;
        try {
            result = (await signOut(auth)) as void;
        } catch (e: any) {
            result = {
                error: true,
                msg: e.message,
                code: e.code.replace(/[\W]/g, '_')
            } as ErrorInterface;
        }
        return result;
    };

    /**
     * Check if user is logged in
     * @returns User if found, false if not
     */
    getAuthState = async (): Promise<UserClass | Error> => {
        return new Promise((resolve, reject) => {
            auth.onAuthStateChanged((user) => {
                return user?.uid
                    ? this.getUserClass(user).then(resolve).catch(reject)
                    : reject(new Error('User not found'));
            });
        });
    };

    /**
     * Update User display name
     * @param user firebase user
     * @param displayName the new display name
     * @returns Promise<void>
     */
    updateUserName = (user: User, displayName: string): Promise<void> => {
        return updateProfile(user, {displayName});
    };

    /**
     * Send password reset email
     * @param email User email
     * @returns Promise<void>
     */
    sendPasswordResetEmail = async (email: string): Promise<void | ErrorInterface> => {
        let result: void | ErrorInterface;
        try {
            result = await sendPasswordResetEmail(auth, email);
        } catch (e: any) {
            result = {
                error: true,
                msg: e.message,
                code: e.code.replace(/[\W]/g, '_')
            } as ErrorInterface;
        }
        return result;
    };
}
