import AbstractInterface from '../abstract/abstractInterface';
import AddressInterface from './addressInterface';
import ConfigInterface, {ModuleInterface} from '../config/configInterface';
import ErrorInterface from './errorInterface';
import UserInterface, {UserData} from '../user/userInterface';
import {User, UserCredential} from 'firebase/auth';

export type {
    AbstractInterface,
    AddressInterface,
    ConfigInterface,
    ErrorInterface,
    ModuleInterface,
    User,
    UserCredential,
    UserData,
    UserInterface
};
