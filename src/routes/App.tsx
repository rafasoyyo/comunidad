import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '../translations/i18n';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

import useWorker from '../useWorker';
import bg from '../workercode';

import Documents from './Documents';
import Events from './Events';
import Home from "./Home";
import Init from "./Init";
import Spaces from './Spaces';
import Login from "./Login";
import Notifications from './Notifications';
import NothingFound from "./NothingFound";
import Profile from "./Profile";
import Receipts from "./Receipts";
import Users from './Users';

import Header from '../components/common/header';

import { getConfig, ConfigContext, ConfigInterface } from '../services/config';
import { ErrorInterface } from '../services/abstractInterface';
import UserService, { UserInterface } from '../services/users';
import AuthService, { User, UserContext } from '../services/auth';

// import './App.css';

function App(): React.ReactElement {
	const { t } = useTranslation();
	const userService = new UserService();
	const authService = new AuthService();

	// const worker = useWorker(bg);
	// React.useEffect(() => {
	// 	if (worker) worker.addEventListener('message', notifyMe);
	// }, [worker]);

	const [isLoading, setLoading] = useState(true);
	const [config, setConfig] = useState({} as ConfigInterface);

	const [isAuth, setAuth] = useState(false);
	const [userData, setUserData] = useState({} as UserInterface);
	const getUser: Function = async (loggedUser: User): Promise<UserInterface | void> => {
		return loggedUser && userService
			.get(loggedUser.uid)
			.then(userFound => setUserData(userFound as UserInterface))
			.catch(error => console.error(error));
	};

	useEffect(() => {
		getConfig()
			.then(async (config: ConfigInterface) => {
				setConfig(config);
				await getUser(await authService.getAuthState());
				setLoading(false);
			})
			.catch((e) => {
				console.log(e);
				setAuth(false);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		authService.getAuthState()
			.then(() => setAuth(true))
			.catch(() => setAuth(false));
	}, ['isAuth']);

	return (
		<ConfigContext.Provider value={config}>
			<p style={{"display": "none" }}>learn react</p>
			{
				!isLoading
					? < BrowserRouter >
						{isAuth ?
							<UserContext.Provider value={userData}>
								<Header setAuth={setAuth} userData={userData} config={config} />
								<main>
									<Routes>
										<Route path={t('rdefault')} element={<Home config={config} />} />
										<Route path={t('rhome')} element={<Home config={config} />} />
										<Route path={t('rlogin')} element={<Navigate replace to={t('rhome')} />} ></Route>
										<Route path={t('rinit')} element={<Init />} />
										<Route path={t('rdocuments')} element={<Documents config={config} />} />
										<Route path={t('rnotifications')} element={<Notifications config={config} />} />
										<Route path={t('rspaces')} element={<Spaces config={config} />} />
										<Route path={t('revents')} element={<Events />} />
										<Route path={t('rreceipts')} element={<Receipts config={config} />} />
										<Route path={t('rusers')} element={<Users config={config} />} />
										<Route path={t('rprofile')} element={<Profile config={config} user={userData} />} />
										<Route path="*" element={<NothingFound />} />
									</Routes>
								</main>
							</UserContext.Provider>
							:
							<main>
								<Routes>
									<Route path={t('rdefault')} element={<Navigate replace to={t('rlogin')} />} ></Route>
									<Route path={t('rlogin')} element={<Login getUser={getUser} setAuth={setAuth} />} />
									<Route path="*" element={<Navigate replace to={t('rlogin')} />} ></Route>
								</Routes>
							</main>
						}
					</BrowserRouter>
					: <Flex width="100vw" height="100vh" align="center" justify="center" direction="column">
						<Spinner size='xl' color="blue.500" thickness='5px' speed='1s' emptyColor='gray.200' />
						<Box m="2">
							<Text>{t('loading')}</Text>
						</Box>
					</Flex>
			}
		</ConfigContext.Provider>
	);
}

export default App;
