import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as ReachLink } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  Checkbox,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import * as bs from 'react-icons/bs';

import { ErrorInterface } from '../../core/interfaces';
import { AuthService } from '../../core/services';
import UserClass from '../../core/user/userClass';
import Layout from '../../components/noAuth';

const authService = new AuthService();

export default function Register(props: { setUser: Function }): React.ReactElement {
  const { t } = useTranslation();
  const [formError, setFormError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passwordRepeatError, setPasswordRepeatError] = useState(false);
  const [privacy, setPrivacy] = useState(true);
  const [privacyError, setPrivacyError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const defaultErrorMsg = t('error.default');
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    if (!name.length || !email.length || !password.length || !privacy) {
      if (!name.length) setNameError(true);
      if (!email.length) setEmailError(true);
      if (!password.length) setPasswordError(true);
      if (!privacy) setPrivacyError(true);
      return;
    }
    if (password !== passwordRepeat) {
      setFormError(t('error.passwordMatch', defaultErrorMsg));
      return;
    }
    setLoading(true);
    const user: UserClass | ErrorInterface = await authService.createUser(name, email, password);
    if ((user as ErrorInterface).error) {
      const msg = (user as ErrorInterface).code;
      setFormError(t('error.' + msg, defaultErrorMsg));
    } else {
      props.setUser(user);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Text fontSize="3xl" align="center" mt="3" mb="4">
        {t('register.title')}
      </Text>

      <form onSubmit={handleRegister} noValidate>
        <FormControl isRequired mt="2" isInvalid={nameError}>
          <FormLabel htmlFor="registerName" type="text">
            {t('form.email')}
          </FormLabel>
          <Input
            id="registerName"
            placeholder={t('form.name')}
            isInvalid={nameError}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setNameError(false)}
            onBlur={(e) => setNameError(e.target.value.length === 0)}
          />
          <FormErrorMessage>{t('error.required')}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired mt="2" isInvalid={emailError}>
          <FormLabel htmlFor="registerEmail" type="email">
            {t('form.email')}
          </FormLabel>
          <Input
            id="registerEmail"
            placeholder={t('form.email')}
            isInvalid={emailError}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailError(false)}
            onBlur={(e) => setEmailError(e.target.value.length === 0)}
          />
          <FormErrorMessage>{t('error.required')}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired mt="6" isInvalid={passwordError}>
          <FormLabel htmlFor="registerPassword" type="password">
            {t('form.password')}
          </FormLabel>
          <InputGroup size="md">
            <Input
              id="registerPassword"
              pr="4.5rem"
              type={showPass ? 'text' : 'password'}
              placeholder={t('form.password')}
              isInvalid={passwordError}
              errorBorderColor="crimson"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordError(false)}
              onBlur={(e) => setPasswordError(e.target.value.length === 0)}
            />
            <InputRightElement width="2rem" right="1">
              <Button
                h="1.75rem"
                size="xs"
                px="2"
                variant="outline"
                color="gray.600"
                borderColor="gray.400"
                onClick={() => setShowPass(!showPass)}
              >
                {<Icon as={showPass ? bs.BsFillEyeSlashFill : bs.BsFillEyeFill} />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{t('error.required')}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired mt="6" isInvalid={passwordRepeatError}>
          <FormLabel htmlFor="registerPasswordRepeat" type="password">
            {t('form.password')}
          </FormLabel>
          <InputGroup size="md">
            <Input
              id="registerPasswordRepeat"
              pr="4.5rem"
              type={showPass ? 'text' : 'password'}
              placeholder={t('form.password')}
              isInvalid={passwordError}
              errorBorderColor="crimson"
              onChange={(e) => setPasswordRepeat(e.target.value)}
              onFocus={() => setPasswordRepeatError(false)}
              onBlur={(e) => setPasswordRepeatError(e.target.value !== password)}
            />
            <InputRightElement width="2rem" right="1">
              <Button
                h="1.75rem"
                size="xs"
                px="2"
                variant="outline"
                color="gray.600"
                borderColor="gray.400"
                onClick={() => setShowPass(!showPass)}
              >
                {<Icon as={showPass ? bs.BsFillEyeSlashFill : bs.BsFillEyeFill} />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{t('error.required')}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={privacyError} mt="4">
          <Checkbox
            isInvalid={privacyError}
            isChecked={privacy}
            onChange={(e) => {
              setPrivacy(e.target.checked);
              setPrivacyError(!e.target.checked);
            }}
          >
            <Text fontSize="sm">
              {t('login.privacy1')}
              <Link href="/privacy" color="blue.600" isExternal>
                {t('login.privacy2')}
              </Link>
            </Text>
          </Checkbox>
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
          {t('register.register')}
        </Button>
        {formError && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{t(formError)}</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        )}
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
