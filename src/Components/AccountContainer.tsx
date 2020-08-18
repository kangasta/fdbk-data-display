import React from 'react';
import { connect } from 'react-redux';

import jwt_decode from 'jwt-decode';

import {
  Typography,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

import { StateType } from '../Reducers/main';
import { LogIn, LogOut, getLoginUrl } from '../Utils/AuthenticationLinks';
import { getDownQuery } from '../Utils/ThemeWrapper';

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
  const downXs = useMediaQuery(getDownQuery('xs'));
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  if (!(clientId && authUrl)) return null;
  const id: any = idToken && jwt_decode(idToken);
  let user;
  if (downXs) {
    user = id?.given_name;
  } else {
    user = id && `${id?.given_name} ${id?.family_name}`;
  }

  const AuthLink = id ? LogOut : LogIn;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const iconProps = id
    ? { onClick: handleClick }
    : { component: 'a', href: getLoginUrl(authUrl, clientId) };

  return (
    <>
      <IconButton
        color="inherit"
        data-testid="account-menu-button"
        {...iconProps}
      >
        <AccountCircle />
      </IconButton>
      <Typography component="span" variant="subtitle1" noWrap>
        {user}
        {id ? null : <AuthLink authUrl={authUrl} clientId={clientId} />}
      </Typography>
      {id && (
        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={handleClose}
          variant="menu"
        >
          <MenuItem>
            <AuthLink authUrl={authUrl} clientId={clientId} />
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

const mapStateToProps = (state: StateType) => ({
  authUrl: state.settings.authUrl,
  clientId: state.settings.clientId,
  idToken: state.authentication?.id_token,
});

export default connect(mapStateToProps)(AccountContainer);
