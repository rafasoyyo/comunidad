import React from 'react';

import {
    Center,
    Container,
    Skeleton,
    Stack,
} from '@chakra-ui/react';


export default function Loading(): React.ReactElement {

    return (
        <Container maxW='container.lg'>
            <Center h={'calc(100vh - 60px)'}>
                <Stack w="50vw">
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                </Stack>
            </Center>
        </Container>
    );
}
