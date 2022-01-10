import {DocumentInterface, ErrorInterface, UserInterface} from '../interfaces';
import {storage} from '../../firebaseSetup';
import {
    deleteObject,
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
} from 'firebase/storage';
const storageRef: StorageReference = ref(storage);

export default class DocumentService {
    private currentUser: UserInterface;

    constructor(currentUser: UserInterface) {
        this.currentUser = currentUser;
    }

    getTagColor = (tag: string): string => {
        return Object.values(this.getDocumentTypes()).find((d) => d.id === tag)?.color || '';
    };

    getDocumentTypes = (): Record<string, Record<string, string>> => {
        return {
            invoice: {
                id: 'invoice',
                color: 'blue.300'
            },
            receipt: {
                id: 'receipt',
                color: 'green.300'
            },
            document: {
                id: 'document',
                color: 'red.300'
            },
            minutes: {
                id: 'minutes',
                color: 'orange.300'
            },
            contract: {
                id: 'contract',
                color: 'purple.300'
            }
        };
    };

    private getValidName = (name: string): string => {
        return name.replace(/[^\w ]/g, '');
    };

    private getFilesReferences = async (path: string): Promise<ListResult | ErrorInterface> => {
        try {
            return (await list(ref(storageRef.root, path))) as ListResult;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    };

    private getFiles = async (path: string): Promise<StorageReference[] | ErrorInterface> => {
        const listFiles = (await this.getFilesReferences(path)) as ListResult;
        return listFiles.items as StorageReference[];
    };

    getFileInfo = async (
        reference: StorageReference
    ): Promise<DocumentInterface | ErrorInterface> => {
        try {
            const promises = await Promise.all([
                reference,
                getDownloadURL(reference),
                getMetadata(reference)
            ]);
            return {
                uid: reference.toString(),
                ref: promises[0],
                url: promises[1],
                metadata: promises[2],
                data: {
                    name: promises[2].name,
                    createdAt: promises[2].timeCreated,
                    ...promises[2].customMetadata
                }
            } as DocumentInterface;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    };

    getFilesInfo = async (
        references: StorageReference[]
    ): Promise<DocumentInterface[] | ErrorInterface> => {
        const promises = references.map((r) => this.getFileInfo(r));
        const files = (await Promise.all(promises)) as DocumentInterface[];
        return files as DocumentInterface[];
    };

    getUserFiles = async (
        userId = this.currentUser.auth.uid
    ): Promise<StorageReference[] | ErrorInterface> => {
        return (await this.getFiles(`users/${userId}`)) as StorageReference[] | ErrorInterface;
    };

    getPublicFiles = async (): Promise<StorageReference[] | ErrorInterface> => {
        return (await this.getFiles('shared')) as StorageReference[] | ErrorInterface;
    };

    getAllFiles = async (): Promise<StorageReference[] | ErrorInterface> => {
        const references = (await Promise.all([this.getPublicFiles(), this.getUserFiles()])) as [
            StorageReference[],
            StorageReference[]
        ];
        const files = [...references[0], ...references[1]] as StorageReference[];
        return files as any[];
    };

    getAllFilesInfo = async (): Promise<DocumentInterface[] | ErrorInterface> => {
        const references = (await this.getAllFiles()) as StorageReference[];
        const promises = references.map((item: StorageReference) => this.getFileInfo(item));
        const files = (await Promise.all(promises)) as DocumentInterface[];
        return files as DocumentInterface[];
    };

    getInvoices = async (
        userId = this.currentUser.auth.uid
    ): Promise<DocumentInterface[] | ErrorInterface> => {
        const references = (await this.getUserFiles(userId)) as StorageReference[];
        const promises = references.map((item: StorageReference) => this.getFileInfo(item));
        let files = (await Promise.all(promises)) as any;
        files = files.filter((item: any) => item.metadata.customMetadata?.type === 'invoice');
        return files as DocumentInterface[];
    };

    private uploadFile = async (
        blob: Blob,
        path: string,
        metadata?: SettableMetadata
    ): Promise<UploadResult | ErrorInterface> => {
        try {
            const reference = ref(storageRef.root, path);
            const file = (await uploadBytes(reference, blob, metadata)) as UploadResult;
            return file;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    };

    private uploadFiles = async (
        files: File[],
        path: string[],
        metadata?: SettableMetadata
    ): Promise<UploadResult[] | ErrorInterface> => {
        const promises: Promise<UploadResult>[] = [];
        files.forEach((file, index) => {
            promises.push(this.uploadFile(file, path[index], metadata) as Promise<UploadResult>);
        });
        const results = await Promise.all(promises);
        return results as UploadResult[];
    };

    uploadPublicFiles = async (
        files: File[],
        metadata?: SettableMetadata
    ): Promise<UploadResult[] | ErrorInterface> => {
        const promises: Promise<UploadResult>[] = [];
        files.forEach((file) => {
            promises.push(
                this.uploadFile(
                    file,
                    'public/' + this.getValidName(file.name),
                    metadata
                ) as Promise<UploadResult>
            );
        });
        const results = await Promise.all(promises);
        return results as UploadResult[];
    };

    uploadUserFiles = async (
        files: File[],
        userId = this.currentUser.auth.uid,
        metadata?: SettableMetadata
    ): Promise<UploadResult[] | ErrorInterface> => {
        const promises: Promise<UploadResult>[] = [];
        files.forEach((file) => {
            promises.push(
                this.uploadFile(
                    file,
                    `users/${userId}/${this.getValidName(file.name)}`,
                    metadata
                ) as Promise<UploadResult>
            );
        });
        const results = await Promise.all(promises);
        return results as UploadResult[];
    };

    updateFileInfo = async (
        path: string,
        metadata: SettableMetadata
    ): Promise<FullMetadata | ErrorInterface> => {
        try {
            const reference = ref(storageRef.root, path) as StorageReference;
            const results = (await updateMetadata(reference, metadata)) as FullMetadata;
            return results as FullMetadata;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    };

    updateFilesInfo = async (
        paths: string[],
        metadata: SettableMetadata
    ): Promise<FullMetadata[] | ErrorInterface> => {
        const promises: Promise<FullMetadata>[] = [];
        paths.forEach((path) => {
            promises.push(this.updateFileInfo(path, metadata) as Promise<FullMetadata>);
        });
        const results = await Promise.all(promises);
        return results as FullMetadata[];
    };

    updatePublicFilesInfo = async (
        metadata: SettableMetadata,
        files?: File[],
        fileNames?: string[]
    ): Promise<FullMetadata[] | ErrorInterface> => {
        const paths: string[] =
            (files?.map((file) => 'public/' + this.getValidName(file.name)) as string[]) ||
            (fileNames?.map((fileName) => 'public/' + this.getValidName(fileName)) as string[]);
        const results = await this.updateFilesInfo(paths, metadata);
        return results as FullMetadata[];
    };

    updateUserFilesInfo = async (
        metadata: SettableMetadata,
        files?: File[],
        fileNames?: string[],
        userId = this.currentUser.auth.uid
    ): Promise<FullMetadata[] | ErrorInterface> => {
        const paths: string[] =
            (files?.map((file) => `users/${userId}/${this.getValidName(file.name)}`) as string[]) ||
            (fileNames?.map(
                (fileName) => `users/${userId}/${this.getValidName(fileName)}`
            ) as string[]);
        const results = await this.updateFilesInfo(paths, metadata);
        return results as FullMetadata[];
    };

    deleteFile = async (path: string): Promise<void | ErrorInterface> => {
        try {
            return (await deleteObject(ref(storageRef.root, path))) as void;
        } catch (e: any) {
            console.error(e);
            return {
                error: true,
                errorMsg: e.message
            } as ErrorInterface;
        }
    };
}
