import React from 'react';
import { connect } from 'react-redux';

import jwt_decode from 'jwt-decode';

import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

import { StateType } from '../Reducers/main';
import { LogIn, LogOut } from '../Utils/AuthenticationLinks';

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
}

export const AccountContainer = ({
  authUrl,
  clientId,
  idToken,
}: AccountContainerProps): React.ReactElement | null => {
  const classes = useStyles();

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

export default connect(mapStateToProps)(AccountContainer);
