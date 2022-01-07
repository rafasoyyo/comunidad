import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Flex, Spinner, Text } from '@chakra-ui/react';
import { ConfigContext } from '../core/contexts';
import { ConfigInterface } from '../core/interfaces';

const animation = `
  background-color: red;
`;

export default function Layout(props: any): React.ReactElement {
  return (
    <ConfigContext.Consumer>
      {(config: ConfigInterface) => (
        <Box
          backgroundImage={config.app?.loginBackground}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          width="100vw"
          height="100vh"
          opacity="0.75"
          pos="absolute"
          top="0"
          left="0"
        >
          <Container maxW="container.sm" h="100vh" px={{ base: '5', sm: '100px' }}>
            <Flex
              bg="white"
              w="100%"
              direction="column"
              py="10"
              className="animated fadeInFromBottom"
              px={{ base: '5', sm: '50px' }}
            >
              {props.children}
            </Flex>
          </Container>
        </Box>
      )}
    </ConfigContext.Consumer>
  );
}

export const NoAuthLoader = (): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <Flex width="100vw" height="100vh" align="center" justify="center" direction="column">
      <Spinner size="xl" color="blue.500" thickness="5px" speed="1s" emptyColor="gray.200" />
      <Box m="2">
        <Text>{t('loading')}</Text>
      </Box>
    </Flex>
  );
};
