import React from 'react';
import { Box, Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid } from '@chakra-ui/react';
import Loading from '../../components/common/loading';
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';
import { t } from 'i18next';

interface modalProps {
    isOpen: boolean;
    userData: any[];
    closeModal: () => void;
}

function Layout(props: {
    isLoading: boolean,
    main?: React.ReactElement,
    mainProps?: any,
    lateral?: React.ReactElement,
    lateralProps?: any,
    modalProps?: any,
}): React.ReactElement {

    const {
        component: MainComponent,
        displayUsers: MainDisplayUsers,
        openModal: MainOpenModal,
        setTitle: MainSetTitle,
    } = (props.mainProps || {});

    const {
        component: LateralComponent,
        allUsers,
        setDisplayUsers,
        openModal,
        setTitle,
    } = (props.lateralProps || {});

    const {
        component: ModalComponent,
        isOpen,
        itemData,
        closeModal,
        title
    } = (props.modalProps || {});

    return (
        !props.isLoading
            ?
            <>
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
                        {
                            props.lateral
                                ? props.lateral
                                : <LateralComponent
                                    allUsers={allUsers}
                                    setDisplayUsers={setDisplayUsers}
                                    openModal={openModal}
                                    setTitle={setTitle} />
                        }
                    </GridItem>

                    <GridItem
                        colSpan={3}
                        h='calc(100vh - 91px)'
                        pb="5"
                        overflowY="auto">
                        {
                            props.main
                                ? props.main
                                :
                                <SimpleGrid
                                    columns={2}
                                    spacing={2}>
                                    {
                                        (MainDisplayUsers || []).map((user: any) => (
                                            <MainComponent
                                                key={user.id}
                                                userData={user}
                                                openModal={MainOpenModal}
                                                setTitle={MainSetTitle} />
                                        ))
                                    }
                                </SimpleGrid >
                        }
                    </GridItem>
                </Grid>
                {
                    props.modalProps &&
                    <Modal
                        isOpen={isOpen}
                        onClose={closeModal}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>{title}</ModalHeader>
                            <ModalCloseButton />
                            <ModalComponent
                                itemData={itemData}
                                closeModal={closeModal} />
                        </ModalContent>
                    </Modal>
                }
            </>
            : <Loading />
    );
}

export default Layout;
