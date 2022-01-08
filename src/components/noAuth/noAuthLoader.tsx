import React from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Flex, Spinner, Text} from '@chakra-ui/react';

export default function NoAuthLoader(): React.ReactElement {
    const {t} = useTranslation();
    return (
        <Flex width="100vw" height="100vh" align="center" justify="center" direction="column">
            <Spinner size="xl" color="blue.500" thickness="5px" speed="1s" emptyColor="gray.200" />
            <Box m="2">
                <Text>{t('loading')}</Text>
            </Box>
        </Flex>
    );
}
