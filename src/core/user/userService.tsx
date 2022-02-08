import {AbstractService} from '../services';
import {AddressInterface, UserData, UserInterface} from '../interfaces';

export const identifier = 'users';

export default class UserService extends AbstractService<UserData> {
    constructor(currentUser?: UserInterface) {
        super(identifier, currentUser as UserInterface);
    }

    /**
     * Create or update a new document in the collection
     * @param item the item to be added or updated
     * @returns Promise<S>
     */
    editAddress = async (item: AddressInterface): Promise<UserData> => {
        let result = {} as UserData;
        console.log(this);
        console.log({item});
        if (this.currentUser) {
            let user = this.currentUser;
            let addresses = user.data.address;
            if (addresses) {
                const index = addresses?.findIndex((a) => a.id === item.id);
                if (index !== -1) {
                    addresses[index] = item;
                } else {
                    addresses = [...addresses, item];
                }
            } else {
                addresses = [item];
            }
            user.data.address = addresses;
            result = (await this.edit(user.data)) as UserData;
        }
        return result;
    };

    /**
     * Delete a document from the collection
     * @param id the id of the document to be deleted
     * @returns Promise<S>
     */
    deleteAddress = async (addressID: string): Promise<UserData> => {
        let result = {} as UserData;
        console.log(this);
        console.log({addressID});
        if (this.currentUser) {
            let user = this.currentUser;
            let addresses = user.data.address;
            user.data.address = addresses?.filter((a) => a.id !== addressID);
            console.log(user.data);
            result = (await this.edit(user.data)) as UserData;
        }
        return result;
    };
}
