import React, {MouseEventHandler, useState} from 'react';
import {Link as RouteLink, NavLink} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {
    Avatar,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Flex,
    Icon,
    IconButton,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Stack,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import {HamburgerIcon, ChevronDownIcon} from '@chakra-ui/icons';

import {ConfigContext} from '../../core/contexts';
import {ConfigInterface, ModuleInterface} from '../../core/interfaces';
import UserClass from '../../core/user/userClass';

const activeStyle = {
    position: 'relative',
    display: 'flex',
    backgroundColor: '#CBD5E0'
};

export default function Header(props: {
    singOut: MouseEventHandler<HTMLButtonElement>;
    user: UserClass;
}): React.ReactElement {
    const {t} = useTranslation();
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <header>
            <Flex
                bg="gray.200"
                color="gray.800"
                py={{base: 2, md: 0}}
                px={{base: 4}}
                boxShadow="base"
                align={'center'}
            >
                {/* Mobile */}
                <Flex
                    flex={{base: 1, md: 'auto'}}
                    ml={{base: -2}}
                    display={{base: 'flex', md: 'none'}}
                >
                    <MobileNav />
                </Flex>

                {/* Desktop */}
                <Flex flex={{base: 1}} align={'center'} justify={{base: 'center', md: 'start'}}>
                    <RouteLink to={t('rhome')}>
                        <Image boxSize="35px" objectFit="cover" src="/icon_clean.png" alt="Logo" />
                    </RouteLink>
                    <Flex display={{base: 'none', md: 'flex'}} ml={10} h="100%">
                        <DesktopNav />
                    </Flex>
                </Flex>

                {/* User area */}
                <Stack
                    flex={{base: 1, md: 0}}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}
                    onMouseEnter={() => setMenuOpen(true)}
                    onMouseLeave={() => setMenuOpen(false)}
                >
                    <Menu isOpen={isMenuOpen}>
                        <MenuButton onClick={() => setMenuOpen(true)}>
                            <Flex flexDirection="row" align="center">
                                <Avatar
                                    bg="white"
                                    size="md"
                                    name={props.user.getItem('name')}
                                    src={props.user.getItem('image') || '/default_user.png'}
                                />
                                <ChevronDownIcon w={6} h={6} />
                            </Flex>
                        </MenuButton>
                        <MenuList onClick={() => setMenuOpen(false)}>
                            <MenuItem>
                                <RouteLink to={t('rprofile')} style={{width: '100%'}}>
                                    {t('header.profile')}
                                </RouteLink>
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={props.singOut}>{t('logout')}</MenuItem>
                        </MenuList>
                    </Menu>
                </Stack>
            </Flex>
        </header>
    );
}

const DesktopNav = (): React.ReactElement => {
    return <RoutesList className="headerDesktop" />;
};

const MobileNav = (): React.ReactElement => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
            <IconButton
                onClick={onOpen}
                icon={<HamburgerIcon w={5} h={5} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
            />
            <Drawer isOpen={isOpen} onClose={onClose} placement="left">
                <DrawerOverlay />
                <DrawerContent bg="gray.50">
                    <DrawerCloseButton />
                    {/* <DrawerHeader></DrawerHeader> */}
                    <RoutesList onClose={onClose} className="headerMobile" />
                </DrawerContent>
            </Drawer>
        </>
    );
};

const RoutesList = (props: {
    className: string;
    onClose?: MouseEventHandler<HTMLAnchorElement> | undefined;
}): React.ReactElement => {
    const {t} = useTranslation();

    return (
        <ConfigContext.Consumer>
            {({modules}: ConfigInterface) => (
                <Stack
                    pt={{base: '50px', md: '0'}}
                    direction={{base: 'column', md: 'row'}}
                    className={props.className}
                >
                    {(modules || []).map((navItem: ModuleInterface) => (
                        <NavLink
                            key={navItem.label}
                            to={t('' + navItem.href) || '#'}
                            style={({isActive}) => (isActive ? activeStyle : {})}
                            onClick={props.onClose ? props.onClose : undefined}
                        >
                            <Flex
                                align="center"
                                minH={{base: '50px', md: '58px'}}
                                px={{base: '6', md: '1', lg: '2'}}
                            >
                                <Icon as={navItem.icon} mr={{base: '1', md: '0', lg: '1'}} />
                                <Text p="1" fontSize={{base: 'lg', md: 'xs', lg: 'md'}}>
                                    {t(navItem.label)}
                                </Text>
                            </Flex>
                        </NavLink>
                    ))}
                </Stack>
            )}
        </ConfigContext.Consumer>
    );
};
