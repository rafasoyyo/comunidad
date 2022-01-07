import { User } from 'firebase/auth';
import UserService from './userService';
import UserInterface, { UserData } from './userInterface';

export default class UserClass extends UserService implements UserInterface {
  public auth: User;

  public data: UserData;

  constructor(user: User, userData: UserData) {
    super();
    this.auth = user;
    this.data = userData;
  }

  getItem(item: string): any {
    const str = item;
    return (
      (this.auth as unknown as Record<string, unknown>)[str] ||
      (this.data as unknown as Record<string, unknown>)[str]
    );
  }

  isAdmin(): boolean {
    return this.data.admin?.role === 'admin';
  }

  isVerified(): boolean {
    return this.data.admin?.verified || false;
  }
}
