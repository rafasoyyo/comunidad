import {AbstractService} from '../services';
import {AddressInterface, UserInterface} from '../interfaces';

export const identifier = 'address';

export default class AddressService extends AbstractService<AddressInterface> {
    constructor(currentUser: UserInterface) {
        super(identifier, currentUser as UserInterface);
    }
}
