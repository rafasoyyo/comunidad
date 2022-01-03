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
    modalProps?: any,
}): React.ReactElement {

    const {
        component: Maincomponent,
        displayUsers,
        openModal
    } = (props.mainProps || {});

    const {
        component: ModalComponent,
        save,
        saveAndClose,
        isSaving,
        isSavingAndClosing,
        isOpen,
        userData,
        setUserData,
        closeModal,
        handleEmailChange
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
                        {props.lateral}
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
                                        (
                                            (displayUsers || []).map((user: any) => (
                                                <Box key={user.id}>
                                                    <Maincomponent userData={user} openModal={openModal} />
                                                </Box>
                                            ))
                                        )
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
                            <ModalHeader>Modal Title</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <form onSubmit={saveAndClose} noValidate>
                                    <ModalComponent
                                        userData={userData}
                                        setUserData={setUserData}
                                        handleEmailChange={handleEmailChange} />
                                </form>
                            </ModalBody>
                            <ModalFooter my="6">
                                <Button
                                    id='saveandclose'
                                    type="submit"
                                    colorScheme='teal'
                                    isLoading={isSavingAndClosing}
                                    onClick={saveAndClose}
                                    rightIcon={<ArrowForwardIcon w={5} h={5} />} >
                                    {t('form.saveandclose')}
                                </Button>
                                <Button
                                    type="submit"
                                    colorScheme='teal'
                                    isLoading={isSaving}
                                    onClick={save}
                                    rightIcon={<ArrowForwardIcon w={5} h={5} />} >
                                    {t('form.save')}
                                </Button>
                                <Button
                                    colorScheme='red'
                                    mx={3}
                                    rightIcon={<CloseIcon w={3} h={3} />}
                                    onClick={() => closeModal()} >
                                    {t('form.close')}
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                }
            </>
            : <Loading />
    );
}

export default Layout;
