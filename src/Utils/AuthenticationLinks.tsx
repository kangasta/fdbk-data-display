import React from 'react';

import { Link } from '@material-ui/core';

export interface LinkProps {
  authUrl: string;
  clientId: string;
}

export const getCurrentUrl = (): string => {
  const url = window.location.href.match(/https{0,1}:\/\/[^/#?]+/);
  return url ? url[0] : '';
};

export const LogIn = ({ authUrl, clientId }: LinkProps) => (
  <Link
    color="inherit"
    href={`${authUrl}/login?client_id=${clientId}&response_type=token&scope=openid&redirect_uri=${getCurrentUrl()}/login`}
  >
    Log in
  </Link>
);

export const LogOut = ({ authUrl, clientId }: LinkProps) => (
  <Link
    color="inherit"
    href={`${authUrl}/logout?client_id=${clientId}&&logout_uri=${getCurrentUrl()}`}
  >
    log out
  </Link>
);
