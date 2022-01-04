import { IconType } from 'react-icons';
import { AddressInterface } from './address';

export interface ModuleInterface {
  id: string;
  label: string;
  href: string;
  icon: IconType;
}

export interface ConfigInterface {
  community: {
    name: string;
    address: AddressInterface;
  };
  app: {
    modulesId: string;
  };
  modules: ModuleInterface[];
  getBackgroundImage: () => string;
}
