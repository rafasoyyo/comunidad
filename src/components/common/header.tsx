import React, { useRef, useState } from 'react';
import { Link as RouteLink, NavLink } from "react-router-dom";

import {
    Avatar,
    Box,
    Collapse,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Flex,
    Icon,
    IconButton,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Stack,
    Text,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure
} from '@chakra-ui/react';

import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon
} from '@chakra-ui/icons';

import { useTranslation } from 'react-i18next';
import AuthService from '../../services/auth';
import { UserInterface } from '../../services/users';
import { ConfigInterface, ModuleInterface } from '../../services/config';

const activeStyle = {
    display: 'flex',
    backgroundColor: '#E2E8F0',
    textDecoration: 'underline',
    color: 'gray.900',
};

export default function Header(props: {
    userData: UserInterface,
    setAuth: Function,
    config: ConfigInterface
}): React.ReactElement {
    const { t } = useTranslation();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const authService = new AuthService();
    const singOut = () => {
        authService.logoutUser();
        props.setAuth(false);
    };

    return (
        <header>
            <Box>
                <Flex
                    bg={useColorModeValue('white', 'gray.800')}
                    color={useColorModeValue('gray.600', 'white')}
                    py={{ base: 2, md: 0 }}
                    px={{ base: 4 }}
                    // borderBottom={1}
                    // borderStyle={'solid'}
                    boxShadow='base'
                    // borderColor={useColorModeValue('gray.200', 'gray.900')}
                    align={'center'} >

                    {/* Mobile */}
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}>
                        <MobileNav {...props.config} />
                    </Flex>

                    {/* Desktop */}
                    <Flex flex={{ base: 1 }} align={'center'} justify={{ base: 'center', md: 'start' }} >
                        <RouteLink to={t('rhome')}>
                            <Image boxSize='35px'
                                objectFit='cover'
                                src='/apartamentos.png'
                                alt='Logo' />
                        </RouteLink>
                        < Flex display={{ base: 'none', md: 'flex' }} ml={10} h="100%">
                            <DesktopNav {...props.config} />
                        </Flex>
                    </Flex>

                    {/* User area */}
                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={6}
                        onMouseEnter={() => setMenuOpen(true)}
                        onMouseLeave={() => setMenuOpen(false)}>
                        <Menu isOpen={isMenuOpen}>
                            <MenuButton onClick={() => setMenuOpen(true)}>
                                <Flex flexDirection="row" align="center" >
                                    <Avatar bg="white"
                                        name={props.userData.name}
                                        src={props.userData.image || '/default_user.png'} />
                                    <ChevronDownIcon w={6} h={6} />
                                </Flex>
                            </MenuButton>
                            <MenuList onClick={() => setMenuOpen(false)}>
                                <MenuItem><RouteLink to={t('rprofile')} style={{ width: '100%' }}>{t('header.profile')}</RouteLink></MenuItem>
                                <MenuDivider />
                                <MenuItem onClick={singOut}>{t('logout')}</MenuItem>
                            </MenuList>
                        </Menu>
                    </Stack>
                </Flex>
            </Box>
        </header>
    );
}

const DesktopNav = ({ modules }: ConfigInterface) => {
    const { t } = useTranslation();
    const linkHoverColor = useColorModeValue('gray.900', 'white');

    return (
        <Stack direction={'row'}>
            {
                (modules || []).map((navItem: ModuleInterface) => (
                    <Box key={navItem.label}>
                        <NavLink
                            to={t('' + navItem.href) || '#'}
                            style={({ isActive }) => isActive ? activeStyle : {}}>
                            <Flex direction="row" align="center" minH={'60px'} px="2">
                                <Icon as={navItem.icon} />
                                <Text
                                    p="1"
                                    fontSize={'sm'}
                                    fontWeight={500}
                                    _hover={{
                                        textDecoration: 'underline',
                                        color: linkHoverColor,
                                    }} >
                                    {t(navItem.label)}
                                </Text>
                            </Flex>
                        </NavLink>
                    </Box>
                ))}
        </Stack>
    );
};

const MobileNav = ({ modules }: ConfigInterface) => {
    const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <IconButton
                onClick={onOpen}
                // onClick={() => setDrawerOpen(true)}
                icon={<HamburgerIcon w={5} h={5} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
            />
            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                placement='left'>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    {/* <DrawerHeader></DrawerHeader> */}
                    <Stack
                        bg={useColorModeValue('white', 'gray.800')}
                        display={{ md: 'none' }}
                        pt="45">
                        {
                            (modules || []).map((navItem) => (
                                <Stack key={navItem.label} spacing={4}>
                                    <NavLink
                                        to={t('' + navItem.href) || '#'}
                                        style={({ isActive }) => isActive ? activeStyle : {}}>
                                        <Flex
                                            p="5"
                                            py="1"
                                            onClick={onClose}
                                            justify="start"
                                            align={'center'}
                                            _hover={{
                                                textDecoration: 'none',
                                            }}>
                                            <Icon as={navItem.icon} />
                                            <Text
                                                p="1"
                                                fontSize={'xl'}
                                                fontWeight={600}
                                                color={useColorModeValue('gray.600', 'gray.200')} >
                                                {t(navItem.label)}
                                            </Text>
                                        </Flex>
                                    </NavLink>
                                </Stack>
                            ))
                        }
                    </Stack >
                </DrawerContent>
            </Drawer>
        </>
    );
};
