import React from 'react';
import {
    Grid,
    GridItem,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import Loading from './loading';

export default function Layout(props: {
    isLoading: boolean;
    main: React.ReactElement;
    lateral?: React.ReactElement;
    modal?: React.ReactElement;
    modalProps?: any;
}): React.ReactElement {
    return !props.isLoading ? (
        <>
            <Grid p="15px" templateRows="repeat(1, 1fr)" templateColumns="repeat(4, 1fr)" gap="4">
                <GridItem
                    colSpan={{base: 4, md: 1}}
                    h={{md: 'calc(100vh - 91px)'}}
                    pr={{md: '3'}}
                    borderRight={{md: '1px'}}
                    borderColor={{md: 'gray.300'}}
                >
                    {props.lateral}
                </GridItem>

                <GridItem
                    colSpan={{base: 4, md: 3}}
                    h={{md: 'calc(100vh - 91px)'}}
                    overflowY={{md: 'auto'}}
                >
                    {props.main}
                </GridItem>
            </Grid>
            {props.modalProps && (
                <Modal isOpen={props.modalProps.isOpen} onClose={props.modalProps.onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{props.modalProps.title}</ModalHeader>
                        <ModalCloseButton />
                        {props.modal}
                    </ModalContent>
                </Modal>
            )}
        </>
    ) : (
        <Loading />
    );
}
