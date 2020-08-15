import React from 'react';
import { render } from '@testing-library/react';

import {
  getCurrentUrl,
  getLoginUrl,
  getLogoutUrl,
  LogIn,
  LogOut,
} from '../../Utils/AuthenticationLinks';

describe('getCurrentUrl', (): void => {
  it('returns current url with env PUBLIC_URL without trailing "/"', (): void => {
    window.history.replaceState(null, 'title', 'http://localhost/path');

    process.env.PUBLIC_URL = '/';
    expect(getCurrentUrl()).toEqual('http://localhost');

    process.env.PUBLIC_URL = '/test_public/';
    expect(getCurrentUrl()).toEqual('http://localhost/test_public');
  });
});

describe('getLoginUrl', (): void => {
  it('returns login url', (): void => {
    expect(getLoginUrl('auth_url', 'test_id')).toContain('auth_url/login');
  });
});

describe('getLogoutUrl', (): void => {
  it('returns logout url', (): void => {
    expect(getLogoutUrl('auth_url', 'test_id')).toContain('auth_url/logout');
  });
});

describe('LogIn', (): void => {
  it('provides link to login url', (): void => {
    const { queryByText } = render(
      <LogIn authUrl="http://auth" clientId="id" />
    );
    expect(queryByText('Log in')).toBeInTheDocument();
    expect(queryByText('Log in')).toHaveProperty(
      'href',
      getLoginUrl('http://auth', 'id')
    );
  });
});

describe('LogOut', (): void => {
  it('provides link to logout url', (): void => {
    const { queryByText } = render(
      <LogOut authUrl="http://auth" clientId="id" />
    );
    expect(queryByText('log out')).toBeInTheDocument();
    expect(queryByText('log out')).toHaveProperty(
      'href',
      getLogoutUrl('http://auth', 'id')
    );
  });
});
