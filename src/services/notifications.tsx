import { store } from '../firebaseSetup';
import { collection, doc, getDoc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";

import abstractService from "./abstract";
import { AbstractInterface, ErrorInterface } from "./abstractInterface";
import { current } from "./auth";

const identifier = "notifications";

export interface NotificationInterface extends AbstractInterface {
    title: string;
    msg: string;
    owner: any;
    error: boolean;
}

export default class NotificationService extends abstractService<NotificationInterface> {
    constructor() {
        super(identifier);
    }

    getAllWithOwner = async (): Promise<NotificationInterface[]> => {
        const promises: Promise<NotificationInterface>[] = [];
        let newPromise: Promise<NotificationInterface>;
        await getDocs(collection(store, identifier))
            .then((snapshots) => {
                snapshots.forEach((snapshot) => {
                    newPromise = new Promise((resolve) => {
                        getDoc(doc(store, 'users', snapshot.data().owner.id))
                            .then((children) => {
                                resolve({
                                    ...snapshot.data(),
                                    id: snapshot.id,
                                    owner: children.data()
                                } as NotificationInterface);
                            });
                    });
                    promises.push(newPromise);
                });
            })
            .catch((error) => {
                console.error(error);
            });
        const results: NotificationInterface[] = await Promise.all(promises);
        return results;
    }

    editWithOwner = async (item: NotificationInterface): Promise<NotificationInterface | ErrorInterface> => {
        console.log(item.owner, typeof item.owner);
        console.log(doc(store, '/users/' + current.getId()))
        item.owner = typeof item.owner === 'string'
            ? doc(store, '/users/' + item.owner)
            : item.owner;
        return this.edit(item);
    }
}
