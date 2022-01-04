import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './translations/i18n';
import { useTranslation } from 'react-i18next';
import './App.css';

import { ConfigInterface } from './interfaces';
import ConfigService, { ConfigContext } from './services/config';

import Default from './temp/defaultTemplate';
import Test from './temp/testTemplate';

function App() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<ConfigInterface>({} as ConfigInterface);
  const configService = new ConfigService();

  useEffect(() => {
    configService
      .get()
      .then(async (c: ConfigInterface) => {
        console.log('config', c);
        setConfig(c);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <p>loading</p>
  ) : (
    <ConfigContext.Provider value={config}>
      <img src={config.getBackgroundImage()} alt="backgroundImage" />
      <BrowserRouter>
        <Routes>
          <Route path={t('rdefault')} element={<Default />} />
          <Route path={t('rtest')} element={<Test />} />
        </Routes>
      </BrowserRouter>
    </ConfigContext.Provider>
  );
}

export default App;
