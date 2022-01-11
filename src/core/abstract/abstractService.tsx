import {store} from '../../firebaseSetup';
import {collection, getDoc, getDocs, doc, setDoc, deleteDoc, Timestamp} from 'firebase/firestore';
import {AbstractInterface, ErrorInterface, UserInterface} from '../interfaces';

export default class AbstractService<S extends AbstractInterface> {
    private collectionId: string;

    private currentUser?: UserInterface;

    constructor(collectionId: string, currentUser?: UserInterface) {
        this.collectionId = collectionId;
        this.currentUser = currentUser;
    }

    /**
     * Generate a new unique id
     * @returns string
     */
    generateUID = (): string => {
        return new Date().getTime().toString(32);
    };

    /**
     * Get a document from the collection
     * @param itemId the id of the document
     * @returns Promise<S>
     */
    get = async (itemId: string): Promise<S | ErrorInterface> => {
        const docRef = doc(store, this.collectionId, itemId);
        const docSnap = await getDoc(docRef);

        return docSnap.exists()
            ? ({id: docSnap.id, ...docSnap.data()} as unknown as S)
            : ({error: true, errorMsg: 'No data found'} as ErrorInterface);
    };

    /**
     * Get all documents from the collection
     * @returns Promise<S[]>
     */
    getAll = async (): Promise<S[]> => {
        const results: S[] = [];
        const querySnapshot = await getDocs(collection(store, this.collectionId));
        querySnapshot.forEach((item) => {
            results.push({id: item.id, ...item.data()} as unknown as S);
        });
        return results;
    };

    /**
     * Create or update a new document in the collection
     * @param item the item to be added or updated
     * @returns Promise<S>
     */
    edit = async (item: S): Promise<S | ErrorInterface> => {
        let result: S | ErrorInterface;
        try {
            item.id = typeof item.id === 'string' ? item.id : this.generateUID();
            item.createdAt = item.createdAt || Timestamp.now();
            item.updatedAt = Timestamp.now();
            const docRef = doc(store, this.collectionId, item.id);
            result = (await setDoc(docRef, item)) as unknown as S;
        } catch (e: any) {
            console.error('Error editing item: ', e);
            result = {error: true, errorMsg: e.message} as ErrorInterface;
        }
        return result;
    };

    /**
     * Delete a document from the collection
     * @param id the id of the document to be deleted
     * @returns Promise<S>
     */
    delete = async (id: string): Promise<void | ErrorInterface> => {
        let result: void | ErrorInterface;
        try {
            const docRef = doc(store, this.collectionId, id);
            (await deleteDoc(docRef)) as unknown as S;
        } catch (e: any) {
            console.error('Error deleting item: ', e);
            result = {error: true, errorMsg: e.message} as ErrorInterface;
        }
        return result;
    };
}
