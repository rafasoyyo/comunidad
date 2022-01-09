import {StorageReference, FullMetadata} from 'firebase/storage';

export default interface DocumentInterface {
    url: string;
    metadata: FullMetadata;
    ref: StorageReference;
}
