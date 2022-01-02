import { store } from '../firebaseSetup';
import { collection, getDoc, getDocs, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { AbstractInterface, ErrorInterface } from './abstractInterface';

export default class abstractService<S extends AbstractInterface> {
    private collectionId: string;

    constructor(collectionId: string) {
        this.collectionId = collectionId;
    }

    generateUID = (): string => {
        return (new Date().getTime()).toString(32);
    }

    get = async (itemId: string): Promise<S | ErrorInterface> => {
        const docRef = doc(store, this.collectionId, itemId);
        const docSnap = await getDoc(docRef);

        return docSnap.exists()
            ? { id: docSnap.id, ...docSnap.data() } as unknown as S
            : { error: true, errorMsg: 'No data found' } as ErrorInterface;
    }

    getAll = async (): Promise<S[]> => {
        const results: S[] = [];
        const querySnapshot = await getDocs(collection(store, this.collectionId));
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() } as unknown as S);
        });
        return results;
    }

    edit = async (item: S): Promise<S | ErrorInterface> => {
        let result: S | ErrorInterface;
        try {
            item.id = typeof item.id === 'string' ? item.id : this.generateUID();
            item.createdAt = item.createdAt || Timestamp.now();
            item.updatedAt = Timestamp.now();
            const docRef = doc(store, this.collectionId, item.id)
            result = await setDoc(docRef, item) as unknown as S;
        } catch (e: any) {
            console.error('Error editing item: ', e);
            result = { error: true, errorMsg: e.message } as ErrorInterface;
        }
        return result;
    }

    delete = async (id: string): Promise<void | ErrorInterface> => {
        let result: void | ErrorInterface;
        try {
            const docRef = doc(store, this.collectionId, id)
            await deleteDoc(docRef) as unknown as S;
        } catch (e: any) {
            console.error('Error deleting item: ', e);
            result = { error: true, errorMsg: e.message } as ErrorInterface;
        }
        return result;
    }
}
