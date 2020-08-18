import React from 'react';

import { Link } from '@material-ui/core';

export interface LinkProps {
  authUrl: string;
  clientId: string;
}

const removeTrailingSlash = (url?: string): string => {
  if (!url) return '';
  return url?.endsWith('/') ? url.slice(0, -1) : url;
};

export const getCurrentUrl = (): string => {
  const url = window.location.href.match(/https{0,1}:\/\/[^/#?]+/);
  const postfix = removeTrailingSlash(process.env.PUBLIC_URL);
  return url ? `${url[0]}${postfix}` : '';
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
    Log out
  </Link>
);
