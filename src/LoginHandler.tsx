import React, { useState, useEffect } from 'react';

import { Auth0Provider } from '@auth0/auth0-react';
import axios from 'axios';
import App from './App';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/LoginButton';
import Styles from './components/Styles';
import './components/i18n/config';

const baseUrl = process.env.REACT_APP_BASE_URL;

interface AuthenticationDetails {
  domain: string;
  clientId: string;
  audience: string;
}

const Authenticated: React.FC = () => {
  const { isAuthenticated, user, error, isLoading } = useAuth0();

  if (error) {
    return <div>Error {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div>
        <h2>Loading authentication details from LeapFrog...</h2>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <Styles>
        <div>
          <h1>The Frog is displeased. Login to gain entrance</h1>
          <LoginButton />
        </div>
      </Styles>
    );
  }

  console.log(JSON.stringify(user, null, 2));

  return <App />;
};

export const LoginHandler: React.FC = () => {
  const [hasAuthDetails, setHasAuthDetails] = useState(false);
  const [authDetails, setAuthDetails] = useState<AuthenticationDetails>({ domain: '', clientId: '', audience: '' });

  useEffect(() => {
    (async () => {
      const result = await axios
        .get<AuthenticationDetails>(`${baseUrl}/api/Configuration/auth`)
        .then(r => r.data)
        .catch(_ => {});

      console.log(JSON.stringify(result));
      setAuthDetails(a => {
        return { ...a, ...result, domain: 'ovation-development.auth0.com' };
      });
      setHasAuthDetails(true);
    })();
  }, []);

  if (hasAuthDetails === false) {
    return (
      <div>
        <h2>Loading authentication details from LeapFrog...</h2>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={authDetails.domain}
      clientId={authDetails.clientId}
      audience={authDetails.audience}
      redirectUri={window.location.origin}
      cacheLocation='localstorage'
    >
      <Authenticated />
    </Auth0Provider>
  );
};
