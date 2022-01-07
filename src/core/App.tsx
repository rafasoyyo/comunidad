import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '../translations/i18n';
import { useTranslation } from 'react-i18next';
import { Button } from '@chakra-ui/react';

import Default from '../temp/defaultTemplate';
import Test from '../temp/testTemplate';
import { Login, NotVerified, Register, Offline, Password } from '../pages';
import { NoAuthLoader } from '../components/noAuth';
import UserClass from './user/userClass';

import { ConfigInterface } from './interfaces';
import { AuthService, ConfigService } from './services';
import { ConfigContext, UserContext } from './contexts';

const authService = new AuthService();
const configService = new ConfigService();

const LoggedInRoutes = (props: { user: UserClass; setUser: Function }): React.ReactElement => {
  const { t } = useTranslation();

  const [singOutLoading, setSingOutLoading] = useState(false);

  const singOut = async () => {
    setSingOutLoading(true);
    await authService.logoutUser();
    props.setUser({} as UserClass);
    setSingOutLoading(false);
  };

  return (
    <UserContext.Provider value={props.user}>
      {!props.user.isVerified() ? (
        <NotVerified singOut={singOut} singOutLoading={singOutLoading} />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path={t('rdefault')} element={<Default />} />
            <Route path={t('rtest')} element={<Test />} />
            <Route path="*" element={<Navigate replace to={t('rdefault')} />}></Route>
          </Routes>
          <React.Fragment>
            <Button onClick={singOut}> {t('form.singOut')} </Button>
          </React.Fragment>
        </BrowserRouter>
      )}
    </UserContext.Provider>
  );
};

const LoggedOutRoutes = (props: { setUser: Function }): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <BrowserRouter>
      <Routes>
        <Route path={t('rdefault')} element={<Navigate replace to={t('rlogin')} />}></Route>
        <Route path={t('rlogin')} element={<Login setUser={props.setUser} />} />
        <Route path={t('rregister')} element={<Register setUser={props.setUser} />} />
        <Route path={t('rpassword')} element={<Password />} />
        <Route path="*" element={<Navigate replace to={t('rlogin')} />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [config, setConfig] = useState<ConfigInterface>({} as ConfigInterface);
  const [user, setUser] = useState<UserClass>({} as UserClass);

  useEffect(() => {
    configService
      .get()
      .then(async (c: ConfigInterface) => {
        // console.log('config', c);
        setConfig(c);
        authService
          .getAuthState()
          .then((userClass) => setUser(userClass as UserClass))
          .catch(() => setUser({} as UserClass));
      })
      .catch((c) => {
        // console.error(c);
        setConfig(c as ConfigInterface);
        setIsOnline(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    authService
      .getAuthState()
      .then((userClass) => setUser(userClass as UserClass))
      .catch(() => setUser({} as UserClass));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, ['user']);

  return config.app ? (
    <ConfigContext.Provider value={config}>
      {isOnline ? (
        user?.auth ? (
          <LoggedInRoutes user={user} setUser={setUser} />
        ) : (
          <LoggedOutRoutes setUser={setUser} />
        )
      ) : (
        <Offline />
      )}
    </ConfigContext.Provider>
  ) : (
    <NoAuthLoader />
  );
}

export default App;
