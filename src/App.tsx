import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './translations/i18n';
import { useTranslation } from 'react-i18next';
import './App.css';

import Default from './temp/defaultTemplate';
import Test from './temp/testTemplate';

function App() {
  const { t } = useTranslation();
  return (
    <BrowserRouter>
      <Routes>
        <Route path={t('rdefault')} element={<Default />} />
        <Route path={t('rtest')} element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
