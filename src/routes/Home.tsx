import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@chakra-ui/react';

import { ConfigInterface } from '../services/config';

function Home(props: {
    config: ConfigInterface
}): React.ReactElement {
    const { t } = useTranslation();
    const [community, setCommunity] = useState(props.config.community);
    return (
        <>
            <Text>home</Text>
            <Text>{t('welcome')} {community.name}</Text>
        </>
    );
}

export default Home;
