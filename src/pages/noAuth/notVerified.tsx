import React, {MouseEventHandler} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Center, Text} from '@chakra-ui/react';

import {NoAuthLayout} from '../../components/noAuth/';

export default function NotVerified(props: {
    singOut: MouseEventHandler<HTMLButtonElement>;
    singOutLoading: boolean;
}): React.ReactElement {
    const {t} = useTranslation();

    return (
        <NoAuthLayout>
            <Text fontSize="2xl" align="center" my="2" fontWeight="bold">
                {t('notVerified.title')}
            </Text>
            <Text fontSize="lg" align="justify" mb="4">
                {t('notVerified.text')}
            </Text>
            <Center mt="6">
                <Button isLoading={props.singOutLoading} onClick={props.singOut}>
                    {t('form.singOut')}
                </Button>
            </Center>
        </NoAuthLayout>
    );
}
