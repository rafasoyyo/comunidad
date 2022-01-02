import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import Loading from '../../components/common/loading';


function Layout(props: {
    isLoading: boolean,
    main: React.ReactElement,
    lateral?: React.ReactElement
}): React.ReactElement {
    return (
        !props.isLoading
            ?
            <Grid
                p="15px"
                pb="0"
                templateRows='repeat(1, 1fr)'
                templateColumns='repeat(4, 1fr)'
                gap="4"
            >
                <GridItem
                    colSpan={1}
                    p='3'
                    borderRight='1px'
                    borderColor='gray.300'
                    h='calc(100vh - 91px)'>
                    {props.lateral}
                </GridItem>

                <GridItem
                    colSpan={3}
                    h='calc(100vh - 91px)'
                    pb="5"
                    overflowY="auto">
                    {props.main}
                </GridItem>
            </Grid>
            : <Loading />
    );
}

export default Layout;
