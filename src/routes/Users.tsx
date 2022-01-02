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
    useDisclosure
} from '@chakra-ui/react';
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';
import Layout from '../components/common/layout';

import filters from '../helpers/filters';
import sorter from '../helpers/sorters';
import { ConfigInterface } from '../services/config';
import UserService, { UserInterface } from '../services/users';
import AuthService from '../services/auth';

const userService: UserService = new UserService();
const authService: AuthService = new AuthService();

export default function Users(props: {
    config: ConfigInterface
}): React.ReactElement {
    const [isLoading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([] as UserInterface[]);
    const [displayUsers, setDisplayUsers] = useState([] as UserInterface[]);
    const [selectedUser, setSelectedUser] = useState({} as UserInterface);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const getUserList = () => {
        userService
            .getAll()
            .then((response: UserInterface[]) => {
                // console.log(response);
                setAllUsers(response);
                setDisplayUsers(response);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    const closeModal = (): void => {
        getUserList();
        onClose();
    };

    const openModal = (u: UserInterface) => {
        // console.log({ openModal });
        setSelectedUser(u);
        onOpen();
    }

    useEffect(() => getUserList(), []);

    useEffect(() => console.log('displayUsers'), [displayUsers]);

    return (
        <>
            <Layout
                isLoading={isLoading}
                main={
                    <UserPageComponent
                        displayUsers={displayUsers}
                        openModal={openModal} />
                }
                lateral={
                    <UserPageFilter
                        allUsers={allUsers}
                        setDisplayUsers={setDisplayUsers}
                        openModal={openModal} />
                }
            />
            <HandleUserModal
                isOpen={isOpen}
                userData={selectedUser}
                closeModal={closeModal} />
        </>
    );
}

const UserPageComponent = (props: {
    displayUsers: UserInterface[],
    openModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();

    return (
        <SimpleGrid
            columns={2}
            spacing={2}>
            {
                (props.displayUsers || [])
                    // .sort((a, b) => {
                    //     const valA = { ...a } as unknown as Record<any, any>
                    //     const valB = { ...b } as unknown as Record<any, any>
                    //     // const valueA = (new Date((valB['createdAt']) || 0 )).getTime();
                    //     // const valueB = (new Date((valB['createdAt']) || 0 )).getTime();
                    //     console.log(new Date(valA['createdAt']), new Date(valB['createdAt']));
                    //     console.log(valA['createdAt'], valB['createdAt']);
                    //     console.log(valA['createdAt'] - valB['createdAt']);
                    //     console.log(valA['email'], valB['email']);
                    //     console.log(valA['email'] - valB['email']);
                    //     console.log(valA['email'] > valB['email']);
                    //     console.log(valA['email'] < valB['email']);
                    //     return valA['email'] > valB['email'] ? 1 : -1;
                    // })
                    // .sort(sorter.default('email'))
                    .map((user) => (
                        <Box
                            key={user.id}
                            boxShadow='base'
                            minH='100px'
                            bg='gray.100'
                            border='1px'
                            borderColor='gray.50'
                            p="5"
                            cursor='pointer'
                            onClick={() => props.openModal(user)}>
                            <Text>{user.email}</Text>
                            <Text>{String(user.createdAt?.toDate().toLocaleDateString())}</Text>
                        </Box>
                    ))
            }
        </SimpleGrid>
    )
}

const UserPageFilter = (props: {
    allUsers: UserInterface[],
    setDisplayUsers: Function,
    openModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const user = {} as UserInterface;
    const [sortDir, setSortDir] = useState(true);

    let userListDisplay: UserInterface[] = props.allUsers;

    const typeFilter = (inputValue: string) => {
        userListDisplay = userListDisplay.filter(filters.string, inputValue);
        props.setDisplayUsers([...userListDisplay]);
    }

    const sort = (key: string, type: string) => {
        setSortDir(!sortDir);
        userListDisplay = sorter(userListDisplay, sortDir, key, type);
        props.setDisplayUsers([...userListDisplay]);
    }

    return (
        <Box>
            <Button
                w="100%"
                colorScheme='teal'
                onClick={() => props.openModal(user)}>
                {t('users.add')}
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

const HandleUserModal = (props: {
    isOpen: boolean,
    userData: UserInterface,
    closeModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const [user, setUser] = useState({} as UserInterface);
    const [isSaving, setSaving] = useState(false);
    const [isSavingAndClosing, setSavingAndClosing] = useState(false);

    const save = async () => {
        setSaving(true);
        typeof user.id === 'undefined'
            ? await authService.createUser(user.email)
            : await userService.edit(user);
        setSaving(false);
    }

    const saveAndClose = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSavingAndClosing(true);
        typeof user.id === 'undefined'
            ? await authService.createUser(user.email)
            : await userService.edit(user);
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
                        <FormControl isRequired mt="2">
                            <FormLabel
                                htmlFor='email'
                                type="email">
                                {t('form.email')}
                            </FormLabel>
                            <Input
                                id='loginEmail'
                                placeholder={t('form.email')}
                                defaultValue={props.userData.email}
                                onChange={(e) => setUser({ ...props.userData, email: (e.target.value).trim() })}></Input>
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
                            onClick={() => props.closeModal()} >
                            {t('form.close')}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}
