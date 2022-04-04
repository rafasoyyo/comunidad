import {remoteConfig} from '../../firebaseSetup';
import * as bs from 'react-icons/bs';

import {ConfigInterface, ModuleInterface} from '../interfaces';
import {getValue, fetchAndActivate} from 'firebase/remote-config';

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
            ? serverConfig.app.loginBackgrounds
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

            fetchAndActivate(remoteConfig)
                .then((c) => {
                    const serverConfig = JSON.parse(
                        getValue(remoteConfig, 'config').asString() || '{}'
                    );
                    const modulesId = serverConfig.app?.modulesId || modules.map((m) => m.id);
                    config = {
                        ...serverConfig,
                        modules: modules.filter((m) => modulesId.includes(m.id)),
                        app: {
                            loginBackground: this.getBackgroundImage(serverConfig),
                            ...serverConfig.app
                        }
                    };
                    resolve(config as ConfigInterface);
                })
                .catch((e) => {
                    console.error('Error loading config: ', e);
                    reject(config);
                });
        });
    };
}
