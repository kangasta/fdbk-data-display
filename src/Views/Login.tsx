import React, { useState, useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Backdrop, CircularProgress } from '@material-ui/core';

import { AuthenticationState } from '../Reducers/authentication';
import { Error } from '../Utils/Error';

const LOADING_STATUS = {
  loading: 'Logging in',
};

export type LoginType = any[];
export interface StatusType {
  error?: string;
  loading?: string;
}

export interface LoginProps {
  setAuthentication: (authentication: AuthenticationState) => void;
}

export const Login = ({
  setAuthentication,
}: LoginProps): React.ReactElement => {
  const [status, setStatus] = useState<StatusType>(LOADING_STATUS);
  const history = useHistory();

  useEffect(() => {
    const data = window.location.href.match(/\/login#(.*)/);
    if (!data) {
      setStatus({ error: 'Did not receive credentials.' });
      return;
    }
    const authentication = data[1]
      .split('&')
      .reduce((authObj: any, keyValue: string) => {
        const [key, value] = keyValue.split('=');
        authObj[key] = value;
        return authObj;
      }, {});

    setAuthentication(authentication);
    history.replace('/');
  }, [history, setAuthentication]);

  if (status?.error) {
    return <Error>{status.error}</Error>;
  }

  return (
    <Backdrop open invisible>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setAuthentication: (authentication: AuthenticationState) =>
    dispatch({ type: 'UPDATE_AUTHENTICATION', authentication }),
});

export default connect(null, mapDispatchToProps)(Login);
