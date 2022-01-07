import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Center, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import * as bs from 'react-icons/bs';

import Layout from '../components/noAuth';

export default function NotVerified(props: {
  singOut: MouseEventHandler<HTMLButtonElement>;
  singOutLoading: boolean;
}): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Layout>
      <Text fontSize="3xl" align="center" mt="3" mb="4">
        {t('notVerified.title')}
      </Text>
      <Center mt="6">
        <Button isLoading={props.singOutLoading} onClick={props.singOut}>
          {t('form.singOut')}
        </Button>
      </Center>
    </Layout>
  );
}
