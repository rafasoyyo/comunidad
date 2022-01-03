/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    ModalBody,
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

interface UserPageProps {
    displayUsers?: UserInterface[],
    setDisplayUsers?: React.Dispatch<React.SetStateAction<UserInterface[]>>,
    allUsers?: UserInterface[],
    setAllUsers?: React.Dispatch<React.SetStateAction<UserInterface[]>>,
    openModal: Function
}
export default function Users(props: {
    config: ConfigInterface
}): React.ReactElement {
    const [isLoading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([] as UserInterface[]);
    const [displayUsers, setDisplayUsers] = useState([] as UserInterface[]);
    const [userData, setUserData] = useState({} as UserInterface);
    const [title, setTitle] = useState('');
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
        console.log('closeModal');
        getUserList();
        onClose();
    };

    const openModal = (u: UserInterface) => {
        console.log('openModal');
        setUserData(u);
        onOpen();
    };
    console.log('title', title);

    useEffect(() => getUserList(), []);

    return (
        <>
            <Layout
                isLoading={isLoading}
                // main={
                //     <UserPageComponent
                //         displayUsers={displayUsers}
                //         openModal={openModal} />
                // }
                mainProps={{
                    component: (props: {
                        userData: UserInterface,
                        openModal: Function
                    }): React.ReactElement => {
                        return <UserPageComponent
                            userData={props.userData}
                            openModal={props.openModal}
                            setTitle={setTitle} />
                    },
                    displayUsers,
                    openModal,
                    setTitle
                }}
                // lateral={
                //     <UserPageFilter
                //         allUsers={allUsers}
                //         setDisplayUsers={setDisplayUsers}
                //         openModal={openModal} />
                // }
                lateralProps={{
                    component: (): React.ReactElement => {
                        return <UserPageFilter
                            allUsers={allUsers}
                            setDisplayUsers={setDisplayUsers}
                            openModal={openModal}
                            setTitle={setTitle} />
                    },
                    allUsers,
                    setDisplayUsers,
                    openModal,
                    setTitle,
                }}
                modalProps={{
                    component: (): React.ReactElement => {
                        return <HandleUserModal
                            itemData={userData}
                            closeModal={closeModal} />
                    },
                    isOpen,
                    closeModal,
                    title
                }}
            />
        </>
    );
}

const UserPageComponent = (props: {
    userData: UserInterface,
    openModal: Function,
    setTitle: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const user = props.userData;

    const openModal = () => {
        props.setTitle('Edit user');
        props.openModal(user)
    }

    return (
        <Box
            key={user.id}
            boxShadow='base'
            minH='100px'
            bg='gray.100'
            border='1px'
            borderColor='gray.50'
            p="5"
            cursor='pointer'
            onClick={openModal}>
            <Text>{user.email}</Text>
            <Text>{String(user.createdAt?.toDate().toLocaleDateString())}</Text>
        </Box>
    )
}

const UserPageFilter = (props: {
    allUsers: UserInterface[],
    setDisplayUsers: Function,
    openModal: Function,
    setTitle: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const [sortDir, setSortDir] = useState(true);

    const openModal = () => {
        props.setTitle('Create user');
        props.openModal({} as UserInterface)
    }

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
                onClick={openModal}>
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

import ModalFooterSaver from '../components/common/modalFooter';

const HandleUserModal = (props: {
    itemData: UserInterface,
    closeModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const [user, setUser] = useState(props.itemData);

    const footerRef = useRef<any>(null);
    const triggerRef = (e: React.FormEvent<HTMLFormElement>) => {
        if (footerRef.current) {
            footerRef.current?.triggerSubmit(e)
        }
    }
    return (
        <form onSubmit={triggerRef} noValidate>
            <ModalBody>
                <FormControl isRequired mt="2">
                    <FormLabel
                        htmlFor='name'
                        type="text">
                        {t('form.name')}
                    </FormLabel>
                    <Input
                        key="editorName"
                        id='editorName'
                        placeholder={t('form.name')}
                        value={user.name || ''}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                    >
                    </Input>
                    <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired mt="2">
                    <FormLabel
                        htmlFor='email'
                        type="email">
                        {t('form.email')}
                    </FormLabel>
                    <Input
                        readOnly
                        key="editorEmail"
                        id='editorEmail'
                        placeholder={t('form.email')}
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    >
                    </Input>
                    <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                </FormControl>
            </ModalBody>
            <ModalFooterSaver
                itemData={user}
                closeModal={props.closeModal}
                onSubmit={footerRef} />
        </form>
    )
}
