import {StorageReference, FullMetadata} from 'firebase/storage';

export default interface DocumentInterface {
    id: string;
    url: string;
    metadata: FullMetadata;
    ref: StorageReference;
}
