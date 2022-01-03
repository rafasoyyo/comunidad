/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
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
        console.log('closeModal', userData);
        getUserList();
        onClose();
    };

    const openModal = (u: UserInterface) => {
        console.log('openModal');
        setUserData(u);
        onOpen();
    }

    const [isSaving, setSaving] = useState(false);
    const [isSavingAndClosing, setSavingAndClosing] = useState(false);

    const save = async () => {
        console.log('save', { userData })
        setSaving(true);
        typeof userData.id === 'undefined'
            ? await authService.createUser(userData.email)
            : await userService.edit(userData);
        setSaving(false);
    }

    const saveAndClose = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('saveAndClose', { userData })
        e.preventDefault();
        setSavingAndClosing(true);
        typeof userData.id === 'undefined'
            ? await authService.createUser(userData.email)
            : await userService.edit(userData);
        setSavingAndClosing(false);
        closeModal()
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setUserData({ ...userData, email: (e.target.value).trim() })
    };

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
                        return <UserPageComponent userData={props.userData} openModal={props.openModal} />
                    },
                    displayUsers,
                    openModal
                }}
                lateral={
                    <UserPageFilter
                        allUsers={allUsers}
                        setDisplayUsers={setDisplayUsers}
                        openModal={openModal} />
                }
                modalProps={{
                    component: (props: {
                        userData: UserInterface,
                        setUserData: Function
                    }): React.ReactElement => {
                        return <HandleUserModal
                            userData={props.userData}
                            setUserData={props.setUserData}
                            handleEmailChange={handleEmailChange}
                        />
                    },
                    save,
                    saveAndClose,
                    isSaving,
                    isSavingAndClosing,
                    isOpen,
                    userData,
                    setUserData,
                    closeModal,
                    handleEmailChange
                }}
            />
        </>
    );
}

const UserPageComponent = (props: {
    userData: UserInterface,
    openModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const user = props.userData;
    // console.log('1 selectedUser: ', props.selectedUser);
    // console.log('2 user: ', user);
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
            onClick={() => props.openModal(user)}>
            <Text>{user.email}</Text>
            <Text>{String(user.createdAt?.toDate().toLocaleDateString())}</Text>
        </Box>
    )
}

const UserPageFilter = (props: {
    allUsers: UserInterface[],
    setDisplayUsers: Function,
    openModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
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
                onClick={() => props.openModal({} as UserInterface)}>
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
    userData: UserInterface,
    setUserData: Function,
    handleEmailChange: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    // const [user, setUser] = useState(props.userData);
    console.log(props.userData);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        props.setUserData({ ...props.userData, name: (e.target.value).trim() })
    };

    // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     e.preventDefault();
    //     props.setUserData({ ...props.userData, email: (e.target.value).trim() })
    // };

    return (
        <>
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
                    value={props.userData.name}
                    onChange={handleNameChange}
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
                    key="editorEmail"
                    id='editorEmail'
                    placeholder={t('form.email')}
                    value={props.userData.email}
                    onChange={(e)=> props.handleEmailChange(e)}
                >
                </Input>
                <FormErrorMessage>{t('error.required')}</FormErrorMessage>
            </FormControl>
        </>
    )
}
