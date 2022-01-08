import {AbstractService} from '../services';
import {UserData} from '../interfaces';

export const identifier = 'users';

export default class UserService extends AbstractService<UserData> {
    constructor() {
        super(identifier);
    }
}
