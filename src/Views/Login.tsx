import React, { useState, useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Backdrop, CircularProgress } from '@material-ui/core';

import { AuthenticationState } from '../Reducers/authentication';
import { Error } from '../Utils/Error';
import {
  setAuthentication,
  clearAuthentication,
} from '../Utils/actionCreators';

const LOADING_STATUS = {
  loading: 'Logging in',
};

export interface StatusType {
  error?: string;
  loading?: string;
}

export interface LoginProps {
  setAuthentication: (authentication: AuthenticationState) => void;
  clearAuthentication: () => void;
}

export const Login = ({
  setAuthentication,
  clearAuthentication,
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
        if (key === 'expires_in') {
          authObj[key] = Number(value);
        } else {
          authObj[key] = value;
        }
        return authObj;
      }, {});

    setAuthentication(authentication);
    history.replace('/');
    const clearAuthTimer = setTimeout(
      clearAuthentication,
      authentication.expires_in
    );

    return () => clearTimeout(clearAuthTimer);
  }, [history, setAuthentication, clearAuthentication]);

  if (status?.error) {
    return <Error>{status.error}</Error>;
  }

  return (
    <Backdrop open invisible>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setAuthentication, clearAuthentication }, dispatch);

export default connect(null, mapDispatchToProps)(Login);
