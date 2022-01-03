import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Box,
	Button,
	Center,
	Checkbox,
	Container,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Text
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons';
import * as bs from 'react-icons/bs'
import { ErrorInterface } from "../services/abstractInterface";
import AuthService, { User } from '../services/auth';
// import { Link as RouteLink} from 'react-router-dom';

const image: string = (Math.round(Math.random() * 10) % 2 === 0)
	? "url('/login_1.jpg')"
	: "url('/login_2.jpg')";

const loginErrorStates: any = {
	'Firebase: Error (auth/wrong-password).': 'invalidCredentials',
	'Firebase: Error (auth/user-not-found).': 'invalidCredentials',
	'default': 'invalidLogin'
}

function Login(props: {
	setAuth: Function,
	getUser: Function
}): React.ReactElement {
	const { t } = useTranslation();
	const [formError, setFormError] = useState('');
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [privacy, setPrivacy] = useState(true);
	const [privacyError, setPrivacyError] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const authService = new AuthService();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email.length || !password.length || !privacy) {
			if (!email.length) setEmailError(true);
			if (!password.length) setPasswordError(true);
			if (!privacy) setPrivacyError(true);
			return;
		}
		setLoading(true);
		const userlogin: User | ErrorInterface = await authService.loginUser(email, password);
		if ((userlogin as ErrorInterface).error) {
			const errorCode = loginErrorStates[(userlogin as ErrorInterface).errorMsg];
			// eslint-disable-next-line no-extra-boolean-cast
			setFormError(!!errorCode ? errorCode : loginErrorStates['default']);
		} else {
			const data = await props.getUser(userlogin);
			props.setAuth(true);
		}
		setLoading(false);
	}

	const getCredentials = (): void => {
		navigator.credentials.get()
			.then((e) => {
				console.log('then: ', e);
			})
			.catch((e) => {
				console.log('catch: ', e);
			});
	}

	return (
		<Box
			backgroundImage={image}
			backgroundPosition="top center"
			backgroundRepeat="no-repeat"
			backgroundSize="cover"
			width="100vw"
			height="100vh"
			opacity="0.75"
			pos="fixed"
			top="0"
			left="0"
		>
			<Container id='pageLogin' pos="relative" bg='white' p="25px" mt="20vh" w={{ base: '95%', md: '400px' }}>
				<Text fontSize="3xl" align="center" mt="3" mb="4">{t("login.title")}</Text>
				<form onSubmit={handleLogin} noValidate>
					<FormControl isRequired mt="2" isInvalid={emailError}>
						<FormLabel
							htmlFor='loginEmail'
							type="email">
							{t('form.email')}
						</FormLabel>
						<Input
							id='loginEmail'
							placeholder={t('form.email')}
							isInvalid={emailError}
							onChange={(e) => setEmail(e.target.value)}
							onFocus={() => setEmailError(false)}
							onBlur={(e) => setEmailError(e.target.value.length === 0)} />
						<FormErrorMessage>{t('error.required')}</FormErrorMessage>
					</FormControl>

					<FormControl isRequired mt="6" isInvalid={passwordError}>
						<FormLabel
							htmlFor='password'
							type="password">
							{t('form.password')}
						</FormLabel>
						<InputGroup size='md'>
							<Input
								pr='4.5rem'
								type={showPass ? 'text' : 'password'}
								placeholder={t('form.password')}
								isInvalid={passwordError}
								errorBorderColor='crimson'
								onChange={(e) => setPassword(e.target.value)}
								onFocus={() => setPasswordError(false)}
								onBlur={(e) => setPasswordError(e.target.value.length === 0)} />
							<InputRightElement width='2rem' right="1">
								<Button
									h='1.75rem'
									size='xs'
									px="2"
									variant="outline"
									color='gray.600'
									borderColor='gray.400'
									onClick={() => setShowPass(!showPass)}>
									{showPass ? <Icon as={bs.BsFillEyeSlashFill} /> : <Icon as={bs.BsFillEyeFill} />}
								</Button>
							</InputRightElement>
						</InputGroup>
						<FormErrorMessage>{t('error.required')}</FormErrorMessage>
					</FormControl>
					<Link href='/forgot-password' align="right">
						<Text
							color="blue.700"
							fontSize="sm"> Necesito recuperar mi contraseña
						</Text>
					</Link>

					<FormControl isInvalid={privacyError} mt="4">
						<Checkbox
							isInvalid={privacyError}
							isChecked={privacy}
							onChange={(e) => { setPrivacy(e.target.checked); setPrivacyError(!e.target.checked) }}>
							<Text fontSize='sm'>{t('login.privacy1')}
								<Link href="/privacy" color='blue.600' isExternal>{t('login.privacy2')}</Link>
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
						isLoading={isLoading}>
						{t('form.enter')}
					</Button>
					{formError && <p>{t(formError)}</p>}
				</form>
				<Center mt="6">
					<Text
						fontSize="sm">¿Aún no tienes cuenta?
						<Button
							type="button"
							mx="2"
							size="sm"
							variant="outline"
							colorScheme='teal'
							onClick={getCredentials} >
							Crea una ahora
						</Button>
					</Text>
				</Center>
			</Container >
		</Box>
	);
}

export default Login;
