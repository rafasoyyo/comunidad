import React, {useContext, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    SimpleGrid,
    Spacer,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Textarea,
    useDisclosure
} from '@chakra-ui/react';
import {
    AddIcon,
    ArrowForwardIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CloseIcon,
    DeleteIcon,
    EditIcon,
    SearchIcon
} from '@chakra-ui/icons';

import {UserContext} from '../../core/contexts';
import {AddressInterface, EventInterface, UserInterface} from '../../core/interfaces';
// import {ModalSaleFooter} from '../../components';
import {UserService} from '../../core/services';
import {remove} from 'firebase/database';
import userService from '../../core/user/userService';

export default function Profile(): React.ReactElement {
    const {t, i18n} = useTranslation();

    const user = useContext(UserContext);
    const userService = new UserService(user);
    // const user = userContext.auth.toJSON();
    console.log({user});

    return (
        <Box bg="gray.50" height="100%" p="10">
            <SimpleGrid columns={{base: 1, md: 2}} spacing="8" color="gray.800">
                <Box boxShadow="base" p="6" rounded="md" bg="white">
                    <Text fontSize="24px">Profile</Text>
                    <Divider />
                    <Box pt="6">
                        <Text>{user.auth.displayName || user.data.name}</Text>
                        <Text>{user.auth.email}</Text>
                    </Box>
                </Box>
                <Box boxShadow="base" p="6" rounded="md" bg="white">
                    lg
                </Box>
                <Addresses user={user} userService={userService} />
                <Box boxShadow="base" p="6" rounded="md" bg="white">
                    xl
                </Box>
            </SimpleGrid>
        </Box>
    );
}

const Addresses = (props: {user: UserInterface; userService: UserService}): React.ReactElement => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [address, setAddress] = useState({} as AddressInterface);
    const {auth, data} = props.user;

    // useMemo(() => {}, [address]);

    console.log(data);
    const openModal = (json: AddressInterface, title?: string) => {
        // setModalTitle(title);
        console.log({json});
        setAddress(json);
        onOpen();
    };

    return (
        <Box boxShadow="base" p="6" rounded="md" bg="white">
            <Flex>
                <Text fontSize="24px">Addresses</Text>
                <Spacer />
                <IconButton
                    w={3}
                    h={8}
                    icon={<AddIcon w={4} h={4} />}
                    aria-label={''}
                    onClick={() => openModal({} as AddressInterface, '')}
                />
            </Flex>
            <Divider />
            {data.address?.length ? (
                <Box pt="6">
                    <Tabs>
                        <TabList>
                            {data.address.map((a: AddressInterface) => (
                                <Tab key={a.id}>{a.alias}</Tab>
                            ))}
                        </TabList>
                        <TabPanels>
                            {data.address.map((a: AddressInterface) => (
                                <TabPanel key={a.id}>
                                    <Text>{a.street}</Text>
                                    <Text>{a.zip}</Text>
                                    <Button onClick={() => openModal(a, '')}>Edit</Button>
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </Tabs>
                </Box>
            ) : (
                <Center pt="6">
                    <Text>No addresses found, create your first address</Text>
                </Center>
            )}
            <AddressEventsModal
                address={address}
                setAddress={setAddress}
                userService={props.userService}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
};

const AddressEventsModal = (props: {
    address: AddressInterface;
    setAddress: Function;
    userService: UserService;
    isOpen: boolean;
    onClose: any;
}): React.ReactElement => {
    const {t} = useTranslation();
    const address = props.address;
    const setAddress = props.setAddress;
    const [errors, setErrors] = useState({
        alias: false,
        street: false,
        number: false,
        zip: false
    });
    const [isSaving, setSaving] = useState(false);
    const [isSavingAndClosing, setSavingAndClosing] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    const isEdit = props.address.id ? true : false;

    console.log(address, props.address);
    const validate = (): boolean => {
        const isValid = address.alias && address.street && address.zip && address.number;
        if (!isValid) {
            setErrors({
                alias: !address.alias,
                street: !address.street,
                number: !address.number,
                zip: !address.zip
            });
        }
        // console.log(isValid, !!isValid, errors);
        return !!isValid;
    };

    const save = async () => {
        if (validate()) {
            setSaving(true);
            await props.userService.editAddress(address);
            setSaving(false);
            // props.dispatch({type: type, data: props.item});
        }
    };

    const saveAndClose = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            setSavingAndClosing(true);
            await props.userService.editAddress(address);
            setSavingAndClosing(true);
            // props.dispatch({type: type, data: props.item});
            // props.closeModal();
        }
    };

    const remove = async () => {
        setDeleting(true);
        await props.userService.deleteAddress(address.id);
        setDeleting(false);
        // props.dispatch({type: 'delete', data: props.item});
        // props.closeModal();
    };

    return (
        <Modal size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader align="center">
                    <Text fontSize="30px" color="gray.600">
                        {t(isEdit ? 'address.modal.edit' : 'address.modal.add', 'Direcciones')}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={saveAndClose} noValidate>
                    <ModalBody>
                        <FormControl isRequired mt="2" isInvalid={errors.alias}>
                            <FormLabel htmlFor="alias" type="text">
                                {t('alias') + ': '}
                            </FormLabel>
                            <Input
                                id="alias"
                                placeholder={t('alias')}
                                defaultValue={address.alias}
                                onChange={(e) => setAddress({...address, alias: e.target.value})}
                                onFocus={() => setErrors({...errors, alias: false})}
                            ></Input>
                            <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired mt="2" isInvalid={errors.street}>
                            <FormLabel htmlFor="street" type="text">
                                {t('address.street') + ': '}
                            </FormLabel>
                            <Input
                                id="street"
                                placeholder={t('address.street')}
                                defaultValue={address.street}
                                onChange={(e) => setAddress({...address, street: e.target.value})}
                                onFocus={() => setErrors({...errors, street: false})}
                            ></Input>
                            <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                        </FormControl>

                        <HStack mt="2">
                            <FormControl isRequired isInvalid={errors.street}>
                                <FormLabel htmlFor="number" type="text">
                                    {t('address.number') + ': '}
                                </FormLabel>
                                <Input
                                    id="number"
                                    placeholder={t('address.number')}
                                    defaultValue={address.number}
                                    onChange={(e) =>
                                        setAddress({...address, number: e.target.value})
                                    }
                                    onFocus={() => setErrors({...errors, number: false})}
                                ></Input>
                                <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                            </FormControl>

                            <FormControl mt="2">
                                <FormLabel htmlFor="zip" type="text">
                                    {t('address.zip') + ': '}
                                </FormLabel>
                                <Input
                                    id="zip"
                                    placeholder={t('address.zip')}
                                    defaultValue={address.zip}
                                    onChange={(e) => setAddress({...address, zip: e.target.value})}
                                ></Input>
                            </FormControl>
                        </HStack>
                    </ModalBody>

                    <ModalFooter my="6">
                        <Button
                            id="saveandclose"
                            size="sm"
                            type="submit"
                            colorScheme="teal"
                            mr="2"
                            isLoading={isSavingAndClosing}
                            rightIcon={<ArrowForwardIcon w={5} h={5} />}
                        >
                            {t('form.saveandclose')}
                        </Button>
                        <Button
                            id="save"
                            size="sm"
                            type="button"
                            colorScheme="teal"
                            mr="2"
                            isLoading={isSaving}
                            onClick={save}
                            rightIcon={<ArrowForwardIcon w={5} h={5} />}
                        >
                            {t('form.save')}
                        </Button>
                        {address.id && (
                            <Button
                                colorScheme="orange"
                                size="sm"
                                mr="2"
                                isLoading={isDeleting}
                                onClick={remove}
                                rightIcon={<DeleteIcon w={3} h={3} />}
                            >
                                {t('form.delete')}
                            </Button>
                        )}
                        <Button
                            colorScheme="red"
                            size="sm"
                            rightIcon={<CloseIcon w={3} h={3} />}
                            onClick={props.onClose}
                        >
                            {t('form.close')}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};
