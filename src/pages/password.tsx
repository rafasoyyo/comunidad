import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as ReachLink } from 'react-router-dom';
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Text
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import * as bs from 'react-icons/bs';

import { AuthService } from '../core/services';
import Layout from '../components/noAuth';

export default function Password(): React.ReactElement {
  const authService = new AuthService();

  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const defaultErrorMsg = t('error.default');
  const handlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    authService
      .sendPasswordResetEmail(email)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  return (
    <Layout>
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
      <Center mt="6">
        <Text>
          {t('register.alreadyAccount')}
          <Link as={ReachLink} to={t('rlogin')} mx="2" color="blue.600">
            {t('register.loginAccount')}
          </Link>
        </Text>
      </Center>
    </Layout>
  );
}
