import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Text } from '@chakra-ui/react';
import logo from '../logo.svg';
import '../App.css';

function Default() {
  const { t } = useTranslation();
  return (
    <Box className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text>{t('welcome')}</Text>
          <Text>Learn React</Text>
        </a>
      </header>
    </Box>
  );
}

export default Default;
