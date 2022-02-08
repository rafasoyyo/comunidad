import AbstractInterface from '../abstract/abstractInterface';
import AddressInterface from '../address/addressInterface';
import ConfigInterface, {ModuleInterface} from '../config/configInterface';
import DocumentInterface from '../document/documentInterface';
import ErrorInterface from './errorInterface';
import EventInterface from '../event/eventInterface';
import UserInterface, {UserData} from '../user/userInterface';

import {FullMetadata, SettableMetadata, StorageReference, UploadResult} from 'firebase/storage';
import {User, UserCredential} from 'firebase/auth';

export type {
    AbstractInterface,
    AddressInterface,
    ConfigInterface,
    DocumentInterface,
    ErrorInterface,
    EventInterface,
    FullMetadata,
    ModuleInterface,
    SettableMetadata,
    StorageReference,
    User,
    UserCredential,
    UserData,
    UserInterface,
    UploadResult
};
