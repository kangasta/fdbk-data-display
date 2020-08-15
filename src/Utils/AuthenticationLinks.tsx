import React from 'react';

import { Link } from '@material-ui/core';

export interface LinkProps {
  authUrl: string;
  clientId: string;
}

export const getCurrentUrl = (): string => {
  const url = window.location.href.match(/https{0,1}:\/\/[^/#?]+/);
  return url ? `${url[0]}${process.env.PUBLIC_URL}` : '';
};

export const getLoginUrl = (authUrl: string, clientId: string): string =>
  `${authUrl}/login?client_id=${clientId}&response_type=token&scope=openid&redirect_uri=${getCurrentUrl()}/login`;

export const getLogoutUrl = (authUrl: string, clientId: string): string =>
  `${authUrl}/logout?client_id=${clientId}&&logout_uri=${getCurrentUrl()}`;

export const LogIn = ({ authUrl, clientId }: LinkProps) => (
  <Link color="inherit" href={getLoginUrl(authUrl, clientId)}>
    Log in
  </Link>
);

export const LogOut = ({ authUrl, clientId }: LinkProps) => (
  <Link color="inherit" href={getLogoutUrl(authUrl, clientId)}>
    log out
  </Link>
);
