import React, { useEffect, useState, createContext } from 'react';
import { database } from '../firebaseSetup';
import { ref, get, child } from "firebase/database";

import * as bs from 'react-icons/bs'
import { IconType } from 'react-icons'

export interface ModuleInterface {
    label: string;
    href: string;
    icon: IconType;
}

const modules: Array<ModuleInterface> = [
    {
        label: 'home.name',
        href: 'rhome',
        icon: bs.BsFillHouseFill
    },
    {
        label: 'documents.name',
        href: 'rdocuments',
        icon: bs.BsFillFolderFill
    },
    {
        label: 'events.name',
        href: 'revents',
        icon: bs.BsFillCalendarEventFill
    },
    {
        label: 'lands.name',
        href: 'rlands',
        icon: bs.BsSignpost2Fill
    },
    {
        label: 'notifications.name',
        href: 'rnotifications',
        icon: bs.BsFillBellFill
    },
    {
        label: 'receipts.name',
        href: 'rreceipts',
        icon: bs.BsReceipt
    },
    {
        label: 'users.name',
        href: 'rusers',
        icon: bs.BsFillFilePersonFill
    },
];

export interface ConfigInterface {
    community: {
        name: string
    },
    modules: ModuleInterface[]
}

export const ConfigContext = createContext({} as ConfigInterface);

export const getConfig = (): Promise<ConfigInterface | any> => {
    return new Promise((resolve, reject) => {
        get(child(ref(database), `config`))
            .then(snapshot => {
                if (snapshot.exists()) {
                    resolve({ modules: (modules || []), ...snapshot.val() })
                } else {
                    reject(new Error('No date found'));
                }
            })
            .catch(reject);
    });
};
