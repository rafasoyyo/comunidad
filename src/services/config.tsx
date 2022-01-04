import { createContext } from 'react';
import { database } from '../firebaseSetup';
import { ref, get, child } from 'firebase/database';
import * as bs from 'react-icons/bs';

import { ConfigInterface, ModuleInterface } from '../interfaces';

export const ConfigContext = createContext({} as ConfigInterface);

const modules: ModuleInterface[] = [
  {
    id: 'home',
    label: 'home.name',
    href: 'rhome',
    icon: bs.BsFillHouseFill
  },
  {
    id: 'documents',
    label: 'documents.name',
    href: 'rdocuments',
    icon: bs.BsFillFolderFill
  },
  {
    id: 'events',
    label: 'events.name',
    href: 'revents',
    icon: bs.BsFillCalendarEventFill
  },
  {
    id: 'spaces',
    label: 'spaces.name',
    href: 'rspaces',
    icon: bs.BsSignpost2Fill
  },
  {
    id: 'notifications',
    label: 'notifications.name',
    href: 'rnotifications',
    icon: bs.BsFillBellFill
  },
  {
    id: 'receipts',
    label: 'receipts.name',
    href: 'rreceipts',
    icon: bs.BsReceipt
  },
  {
    id: 'users',
    label: 'users.name',
    href: 'rusers',
    icon: bs.BsFillFilePersonFill
  }
];

export default class ConfigService {
  get = (): Promise<ConfigInterface> => {
    return new Promise((resolve, reject) => {
      get(child(ref(database), `config`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const modulesId = snapshot.val().app?.modulesId?.split(',') || modules.map((m) => m.id);
            const config = {
              app: {},
              modules: modules.filter((m) => modulesId.includes(m.id)),
              ...snapshot.val()
            };
            config.getBackgroundImage = (): string => {
              const configBg = config.app.loginBackground
                ? config.app.loginBackground.split(',')
                : ['/login_default.jpg'];
              const index = Math.floor(Math.random() * configBg.length);
              return configBg[index];
            };
            resolve(config as ConfigInterface);
          } else {
            reject(new Error('No config found'));
          }
        })
        .catch(reject);
    });
  };
}
