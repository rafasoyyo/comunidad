import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@chakra-ui/react';

import { ConfigInterface } from '../services/config';
import UserService, { UserInterface } from '../services/users';

function Profile(props: {
    config: ConfigInterface,
    user: UserInterface
}): React.ReactElement {
    const { t } = useTranslation();

    const [isLoading, setLoading] = useState(true);
    const [community, setCommunity] = useState(props.config.community);
    const [userData, setUserData] = useState({} as UserInterface);
    const userService = new UserService();

    useEffect(() => {
        userService
            .get(props.user.id)
            .then((response) => {
                console.log(typeof response, response)
                setUserData(response as UserInterface);
                setLoading(false);
            })
            .catch(() => {
                console.log('response')
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Text>Profile {userData.email}</Text>
            <Text>{t('welcome')} {community.name}</Text>
            <Button onClick={() => { userService.delete(userData.id)} }> Delete</Button>
        </>
    );
}

export default Profile;
