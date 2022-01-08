import React from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Text} from '@chakra-ui/react';

function Test() {
    const {t} = useTranslation();
    return (
        <Box>
            <Text>Other route</Text>
        </Box>
    );
}

export default Test;
