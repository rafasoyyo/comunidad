import { IconType } from 'react-icons';
import { AddressInterface } from '../interfaces';

export interface ModuleInterface {
  id: string;
  label: string;
  href: string;
  icon: IconType;
}

export default interface ConfigInterface {
  community: {
    name: string;
    address: AddressInterface;
  };
  app: {
    modulesId: string;
    loginBackground?: string;
    loginBackgrounds: string;
  };
  modules: ModuleInterface[];
}
