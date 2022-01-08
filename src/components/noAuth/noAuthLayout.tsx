import React from 'react';
import {Box, Container, Flex, Spinner, Text} from '@chakra-ui/react';
import {ConfigContext} from '../../core/contexts';
import {ConfigInterface} from '../../core/interfaces';

export default function NoAuthLayout(props: any): React.ReactElement {
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
                    <Container maxW="container.sm" h="100vh" px={{base: '5', sm: '100px'}}>
                        <Flex
                            bg="white"
                            w="100%"
                            direction="column"
                            py="10"
                            className="animated fadeInFromBottom"
                            px={{base: '5', sm: '50px'}}
                        >
                            {props.children}
                        </Flex>
                    </Container>
                </Box>
            )}
        </ConfigContext.Consumer>
    );
}
