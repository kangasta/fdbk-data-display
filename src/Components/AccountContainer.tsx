import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  Typography,
  Link,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

import jwt_decode from 'jwt-decode';

import { StateType } from '../Reducers/main';
import { AuthenticationState } from '../Reducers/authentication';

import { getCurrentUrl, LogIn, LogOut } from '../Utils/AuthenticationLinks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      margin: theme.spacing(1),
    },
  })
);

export interface AccountContainerProps {
  authUrl?: string;
  clientId?: string;
  idToken?: string;
  setAuthentication: (authentication: AuthenticationState) => void;
}

export const AccountContainer = ({
  authUrl,
  clientId,
  idToken,
  setAuthentication,
}: AccountContainerProps) => {
  const classes = useStyles();

  useEffect(() => {
    const data = window.location.href.match(/\/login#(.*)/);
    if (data) {
      const authentication = data[1]
        .split('&')
        .reduce((authObj: any, keyValue: string) => {
          const [key, value] = keyValue.split('=');
          authObj[key] = value;
          return authObj;
        }, {});

      setAuthentication(authentication);
      window.history.replaceState(null, '', getCurrentUrl());
    }
  }, [setAuthentication]);

  if (!(clientId && authUrl)) return null;

  const id: any = idToken && jwt_decode(idToken);
  const user = id && `${id?.given_name} ${id?.family_name}, `;

  const AuthLink = id ? LogOut : LogIn;

  return (
    <>
      <AccountCircle className={classes.icon} />
      <Typography component="span" variant="subtitle1" noWrap>
        {user}
        <AuthLink authUrl={authUrl} clientId={clientId} />
      </Typography>
    </>
  );
};

const mapStateToProps = (state: StateType) => ({
  authUrl: state.settings.authUrl,
  clientId: state.settings.clientId,
  idToken: state.authentication?.id_token,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setAuthentication: (authentication: AuthenticationState) =>
    dispatch({ type: 'UPDATE_AUTHENTICATION', authentication }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);
