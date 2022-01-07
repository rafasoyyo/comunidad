import { createContext } from 'react';
import ConfigInterface from './configInterface';

const ConfigContext = createContext({} as ConfigInterface);
export default ConfigContext;
