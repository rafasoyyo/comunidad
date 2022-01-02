import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
    Textarea,
    useDisclosure
} from '@chakra-ui/react';
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';
import Layout from '../components/common/layout';

import filters from '../helpers/filters';
import sorter from '../helpers/sorters';
import { ConfigInterface } from '../services/config';
import NotificationService, { NotificationInterface } from '../services/notifications';
import { current } from '../services/auth';

const notificationService: NotificationService = new NotificationService();

export default function Notifications(props: {
    config: ConfigInterface
}): React.ReactElement {
    const [isLoading, setLoading] = useState(true);
    const [allNotifications, setAllNotifications] = useState([] as NotificationInterface[]);
    const [displayNotifications, setDisplayNotifications] = useState([] as NotificationInterface[]);
    const [selectedNotification, setSelectedNotification] = useState({} as NotificationInterface);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const getNotificationList = () => {
        notificationService
            .getAllWithOwner()
            .then((response: NotificationInterface[]) => {
                console.log({ response });
                setAllNotifications(response);
                setDisplayNotifications(response);
                setLoading(false);
            })
            .catch((e) => {
                // console.log(e);
                setLoading(false);
            });
    }

    const openModal = (n: NotificationInterface) => {
        setSelectedNotification(n);
        onOpen();
    }

    const closeModal = (): void => {
        getNotificationList();
        onClose();
    };

    useEffect(() => getNotificationList(), []);

    return (
        <>
            <Layout
                isLoading={isLoading}
                main={
                    <NotificationPageComponent
                        displayNotifications={displayNotifications}
                        openModal={openModal} />
                }
                lateral={
                    <NotificationPageFilter
                        allNotifications={allNotifications}
                        setDisplayNotifications={setDisplayNotifications}
                        openModal={openModal} />
                }
            />
            <HandleNotificationModal
                isOpen={isOpen}
                notificationData={selectedNotification}
                closeModal={closeModal} />
        </>
    );
}

const NotificationPageComponent = (props: {
    openModal: Function
    displayNotifications: NotificationInterface[],
}): React.ReactElement => {
    const { t } = useTranslation();

    return (
        <SimpleGrid
            columns={2}
            spacing={2}>
            {
                ([...props.displayNotifications] || [])
                    .map((notification: NotificationInterface) => (
                        <Box
                            key={notification.id}
                            boxShadow='base'
                            minH='100px'
                            bg='gray.100'
                            border='1px'
                            borderColor='gray.50'
                            p="5"
                            cursor='pointer'
                            onClick={() => props.openModal(notification)}>
                            <Text>{notification?.msg}</Text>
                            <Text>{notification.owner?.email || 'undefined'}</Text>
                            <Text>{String(notification.createdAt?.toDate().toLocaleDateString())}</Text>
                        </Box>
                    ))
            }
        </SimpleGrid>
    )
}

const NotificationPageFilter = (props: {
    allNotifications: NotificationInterface[],
    setDisplayNotifications: Function,
    openModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const notification = { owner: current.getId() } as NotificationInterface;
    const [sortDir, setSortDir] = useState(true);

    let notificationDisplay: NotificationInterface[] = props.allNotifications;

    const typeFilter = (inputValue: string) => {
        console.log('typeFilter: ', inputValue);
        notificationDisplay = notificationDisplay.filter(filters.string, inputValue);
        props.setDisplayNotifications([...notificationDisplay]);
    }

    const sort = (key: string, type: string) => {
        setSortDir(!sortDir);
        notificationDisplay = sorter(notificationDisplay, sortDir, key, type);
        props.setDisplayNotifications([...notificationDisplay]);
    }

    return (
        <Box>
            <Button
                w="100%"
                colorScheme='teal'
                onClick={() => props.openModal(notification)}>
                {t('notifications.add')}
            </Button>

            <Box
                pt="6">
                <Text
                    fontSize="22"

                    textAlign="center">
                    {t('filters.filter')}</Text>
                <FormControl mt="2">
                    <FormLabel
                        htmlFor='stringFilter'
                        type="text">
                        {t('filters.typetofilter')}
                    </FormLabel>

                    <Input
                        id='stringFilter'
                        placeholder={t('filters.typetofilter')}
                        onChange={(e) => typeFilter(e.target.value)} />
                </FormControl>
            </Box>

            <Box
                pt="10">
                <Text
                    fontSize="22"
                    textAlign="center">
                    {t('sorts.sort')}</Text>
                <Button
                    my="2"
                    w="100%"
                    colorScheme='blue'
                    variant='outline'
                    onClick={() => sort('email', 'string')}>
                    {t('sorts.byEmail')}
                </Button>
                <Button
                    my="2"
                    w="100%"
                    colorScheme='blue'
                    variant='outline'
                    onClick={() => sort('createdAt', 'timestamp')}>
                    {t('sorts.byCreation')}
                </Button>
            </Box>

        </Box>
    )
};

const HandleNotificationModal = (props: {
    isOpen: boolean,
    notificationData: NotificationInterface,
    closeModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const [notification, setNotification] = useState({} as NotificationInterface);
    const [isSaving, setSaving] = useState(false);
    const [isSavingAndClosing, setSavingAndClosing] = useState(false);

    const save = async () => {
        setSaving(true);
        await notificationService.editWithOwner(notification);
        setSaving(false);
    }

    const saveAndClose = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSavingAndClosing(true);
        await notificationService.editWithOwner(notification);
        setSavingAndClosing(true);
        props.closeModal()
    }

    return (
        <Modal isOpen={props.isOpen} onClose={() => props.closeModal()} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={saveAndClose} noValidate>
                    <ModalBody>
                        {/* <Text>Owner name: {props.notificationData.owner.name}</Text>
                        <Text>Owner email: {props.notificationData.owner.email}</Text> */}
                        <FormControl isRequired mt="2">
                            <FormLabel
                                htmlFor='notificationMsg'
                                type="text">
                                {t('form.email')}
                            </FormLabel>
                            <Textarea
                                id='notificationMsg'
                                placeholder={t('form.email')}
                                defaultValue={props.notificationData.msg}
                                onChange={(e) => setNotification({ ...props.notificationData, msg: (e.target.value).trim() })}></Textarea>
                            <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter my="6">
                        <Button
                            id='saveandclose'
                            type="submit"
                            colorScheme='teal'
                            isLoading={isSavingAndClosing}
                            rightIcon={<ArrowForwardIcon w={5} h={5} />} >
                            {t('form.saveandclose')}
                        </Button>
                        <Button
                            id='save'
                            type="button"
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
                            onClick={() => props.closeModal()} >
                            {t('form.close')}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal >
    )
}
