import {AbstractInterface} from '../interfaces';

export default interface AddressInterface extends AbstractInterface {
    alias: string;
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    tower: string;
    door: string;
}
