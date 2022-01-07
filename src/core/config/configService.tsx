import { database } from '../../firebaseSetup';
import { ref, get, child, DataSnapshot } from 'firebase/database';
import * as bs from 'react-icons/bs';

import { ConfigInterface, ModuleInterface } from '../interfaces';

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
  /**
   * Get the image background url for the login form server or return a default one
   * @param serverConfig ConfigInterface
   * @returns Image Url
   */
  getBackgroundImage = (serverConfig: ConfigInterface): string => {
    const configBg = serverConfig.app?.loginBackgrounds
      ? serverConfig.app.loginBackgrounds.split(',')
      : ['/login_default.jpg'];
    const index = Math.floor(Math.random() * configBg.length);
    return configBg[index];
  };

  /**
   * Get the application global configuration.
   * @returns {Promise<ConfigInterface>}
   */
  get = (): Promise<ConfigInterface> => {
    return new Promise((resolve, reject) => {
      let config = {
        app: {
          loginBackground: '/login_default.jpg'
        }
      } as ConfigInterface;

      get(child(ref(database), `config`))
        .then((snapshot: DataSnapshot) => {
          if (snapshot.exists()) {
            const serverConfig = snapshot.val();
            const modulesId = serverConfig.app?.modulesId?.split(',') || modules.map((m) => m.id);
            config = {
              modules: modules.filter((m) => modulesId.includes(m.id)),
              community: { ...serverConfig.community },
              app: {
                loginBackground: this.getBackgroundImage(serverConfig),
                ...serverConfig.app
              }
            };
            resolve(config as ConfigInterface);
          } else {
            reject(config);
          }
        })
        .catch(() => {
          // console.log({ config });
          reject(config);
        });
    });
  };
}
