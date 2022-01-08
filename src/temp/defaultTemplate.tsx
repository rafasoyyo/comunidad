import React, {MouseEventHandler} from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Text} from '@chakra-ui/react';
import {Header} from '../components/auth';
import UserClass from '../core/user/userClass';

function Default(): React.ReactElement {
    const {t} = useTranslation();
    return (
        <>
            <Box className="App">
                <Box className="App-header">
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
                </Box>
            </Box>
        </>
    );
}

export default Default;
