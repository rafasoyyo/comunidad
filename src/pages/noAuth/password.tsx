import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link as ReachLink} from 'react-router-dom';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Button,
    Center,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Link,
    Text
} from '@chakra-ui/react';
import {ArrowForwardIcon} from '@chakra-ui/icons';

import {AuthService} from '../../core/services';
import {NoAuthLayout} from '../../components/noAuth';
import {ErrorInterface} from '../../core/interfaces';

const authService = new AuthService();

export default function Password(): React.ReactElement {
    const {t} = useTranslation();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailSentError, setEmailSentError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const defaultErrorMsg = t('error.default');
    const handlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.length) {
            if (!email.length) setEmailError(true);
            return;
        }
        setEmailSentError('');
        setEmailSent(false);
        setLoading(true);
        const result = await authService.sendPasswordResetEmail(email);
        const emailResult = result as ErrorInterface;
        if (emailResult.error && String(emailResult.code) === 'auth_invalid_email') {
            const msg = (emailResult as ErrorInterface).code;
            setEmailSentError(t('error.' + msg, defaultErrorMsg));
        } else {
            setEmailSent(true);
        }
        setLoading(false);
    };

    return (
        <NoAuthLayout>
            <Text fontSize="3xl" align="center" mt="3" mb="4">
                {t('password.title')}
            </Text>
            <form onSubmit={handlePassword} noValidate>
                <FormControl isRequired mt="2" isInvalid={emailError}>
                    <FormLabel htmlFor="passwordEmail" type="email">
                        {t('form.email')}
                    </FormLabel>
                    <Input
                        id="passwordEmail"
                        placeholder={t('form.email')}
                        isInvalid={emailError}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailError(false)}
                        onBlur={(e) => setEmailError(e.target.value.length === 0)}
                    />
                    <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    my="6"
                    w="100%"
                    color="white"
                    bg="blue.500"
                    rightIcon={<ArrowForwardIcon />}
                    isLoading={isLoading}
                >
                    {t('form.send')}
                </Button>
            </form>
            {emailSent && (
                <Alert status="success">
                    <AlertIcon />
                    <AlertDescription>{t('password.emailSent')}</AlertDescription>
                </Alert>
            )}
            {emailSentError && (
                <Alert status="error">
                    <AlertIcon />
                    <AlertDescription>{t(emailSentError)}</AlertDescription>
                </Alert>
            )}
            <Center mt="6">
                <Text>
                    {t('register.alreadyAccount')}
                    <Link as={ReachLink} to={t('rlogin')} mx="2" color="blue.600">
                        {t('register.loginAccount')}
                    </Link>
                </Text>
            </Center>
        </NoAuthLayout>
    );
}
