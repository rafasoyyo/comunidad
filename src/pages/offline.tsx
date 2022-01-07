import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@chakra-ui/react';

import Layout from '../components/noAuth';

export default function Offline(): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Layout>
      <Text fontSize="3xl" align="center" mt="3" mb="4">
        {t('offline.title')}
      </Text>
    </Layout>
  );
}
