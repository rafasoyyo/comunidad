import { storage } from "../firebaseSetup";
import {
    ref,
    StorageReference,
    list,
    ListResult,
    uploadBytes,
    UploadResult,
    getDownloadURL,
    getMetadata,
    updateMetadata,
    SettableMetadata,
    FullMetadata
} from "firebase/storage";
const storageRef: StorageReference = ref(storage);

import { ErrorInterface } from "./abstractInterface";
import { UserInterface } from "./users";

export default class DocumentService {

    private currentUser: UserInterface;

    constructor(currentUser: UserInterface) {
        this.currentUser = currentUser;
    }

    private getValidName = (name: string): string => {
        return name.replace(/[^\w ]/g, '');
    }
    getTagColor = (tag: string): string => {
        return ({
            document: 'teal',
            invoice: 'blue',
        })[tag] || '' ;
    }
    private getFilesReferences = async (path: string): Promise<ListResult | ErrorInterface> => {
        try {
            return await list(ref(storageRef.root, path)) as ListResult;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    }

    private getFiles = async (path: string): Promise<StorageReference[] | ErrorInterface> => {
        const listFiles = await this.getFilesReferences(path) as ListResult;
        return listFiles.items as StorageReference[];
    }

    getFileInfo = async (reference: StorageReference): Promise<any | ErrorInterface> => {
        try {
            const promises = await Promise.all([reference, getDownloadURL(reference), getMetadata(reference)]);
            return { ref: promises[0], url: promises[1], metadata: promises[2] } as any;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    }

    getUserFiles = async (userId = this.currentUser.id): Promise<StorageReference[] | ErrorInterface> => {
        return await this.getFiles(userId) as StorageReference[] | ErrorInterface;
    }

    getPublicFiles = async (): Promise<StorageReference[] | ErrorInterface> => {
        return await this.getFiles('public') as StorageReference[] | ErrorInterface;
    }

    getAllFiles = async (): Promise<StorageReference[] | ErrorInterface> => {
        const references = await Promise.all([this.getPublicFiles(), this.getUserFiles()]) as [StorageReference[], StorageReference[]];
        const files = [...references[0], ...references[1]] as StorageReference[];
        return files as any[];
    }

    getAllFilesInfo = async (): Promise<StorageReference[] | ErrorInterface> => {
        const references = await this.getAllFiles() as StorageReference[];
        const promises = references.map((item: StorageReference) => this.getFileInfo(item));
        const files = await Promise.all(promises) as any;
        return files as any[];
    }

    getInvoices = async (userId = this.currentUser.id): Promise<StorageReference[] | ErrorInterface> => {
        const references = await this.getUserFiles() as StorageReference[];
        const promises = references.map((item: StorageReference) => this.getFileInfo(item));
        let files = await Promise.all(promises) as any;
        files = files.filter((item: any) => item.metadata.customMetadata?.type === 'invoice');
        return files as any[];
    }

    private uploadFile = async (blob: Blob, path: string, metadata?: SettableMetadata): Promise<UploadResult | ErrorInterface> => {
        try {
            const reference = ref(storageRef.root, path);
            const file = await uploadBytes(reference, blob, metadata) as UploadResult;
            return file;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    }

    private uploadFiles = async (files: File[], path: string[], metadata?: SettableMetadata): Promise<UploadResult[] | ErrorInterface> => {
        const promises: Promise<UploadResult>[] = [];
        files.forEach((file, index) => {
            promises.push(this.uploadFile(file, path[index], metadata) as Promise<UploadResult>);
        });
        const results = await Promise.all(promises);
        return results as UploadResult[];
    }

    uploadPublicFiles = async (files: File[], metadata?: SettableMetadata): Promise<UploadResult[] | ErrorInterface> => {
        const promises: Promise<UploadResult>[] = [];
        files.forEach(file => {
            promises.push(this.uploadFile(file, 'public/' + this.getValidName(file.name), metadata) as Promise<UploadResult>);
        });
        const results = await Promise.all(promises);
        return results as UploadResult[];
    }

    uploadUserFiles = async (files: File[], userId = this.currentUser.id, metadata?: SettableMetadata): Promise<UploadResult[] | ErrorInterface> => {
        const promises: Promise<UploadResult>[] = [];
        files.forEach(file => {
            promises.push(this.uploadFile(file, userId + '/' + this.getValidName(file.name), metadata) as Promise<UploadResult>);
        });
        const results = await Promise.all(promises);
        return results as UploadResult[];
    }

    updateFileInfo = async (path: string, metadata: SettableMetadata): Promise<FullMetadata | ErrorInterface> => {
        try {
            const reference = ref(storageRef.root, path) as StorageReference;
            const results = await updateMetadata(reference, metadata) as FullMetadata;
            return results as FullMetadata;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    }

    updateFilesInfo = async (paths: string[], metadata: SettableMetadata): Promise<FullMetadata[] | ErrorInterface> => {
        const promises: Promise<FullMetadata>[] = [];
        paths.forEach(path => {
            promises.push(this.updateFileInfo(path, metadata) as Promise<FullMetadata>);
        });
        const results = await Promise.all(promises);
        return results as FullMetadata[];
    }

    updatePublicFilesInfo = async (
        metadata: SettableMetadata,
        files?: File[],
        fileNames?: string[]
    ): Promise<FullMetadata[] | ErrorInterface> => {
        // const promises: Promise<SettableMetadata>[] = [];
        const paths: string[] = files?.map(file => 'public/' + this.getValidName(file.name)) as string[]
            || fileNames?.map(fileName => 'public/' + this.getValidName(fileName)) as string[];
        // paths.forEach(file => {
        //     promises.push(this.updateFilesInfo(paths, metadata) as Promise<SettableMetadata>);
        // });
        const results = await this.updateFilesInfo(paths, metadata);
        return results as FullMetadata[];
    }

    updateUserFilesInfo = async (
        metadata: SettableMetadata,
        files?: File[],
        fileNames?: string[],
        userId = this.currentUser.id
    ): Promise<FullMetadata[] | ErrorInterface> => {
        // const promises: Promise<SettableMetadata>[] = [];
        const paths: string[] = files?.map(file => userId + '/' + this.getValidName(file.name)) as string[]
            || fileNames?.map(fileName => userId + '/' + this.getValidName(fileName)) as string[];
        // paths.forEach(path => {
        //     promises.push(this.updateFilesInfo(path, metadata) as Promise<SettableMetadata>);
        // });
        // const results = await Promise.all(promises);
        const results = await this.updateFilesInfo(paths, metadata);
        return results as FullMetadata[];
    }
}