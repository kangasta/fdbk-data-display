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

describe('LogIn and LogOut', (): void => {
  it.each([
    ['getLoginUrl', '/login', getLoginUrl],
    ['getLogoutUrl', '/logout', getLogoutUrl],
  ])('%s contains %s', (_, path, fn): void => {
    expect(fn('auth_url', 'test_id')).toContain(`auth_url${path}`);
  });
  it.each([
    ['LogIn', 'Log in', LogIn, getLoginUrl],
    ['LogOut', 'Log out', LogOut, getLogoutUrl],
  ])('%s has correct link with %s text', (_, text, CUT, helper): void => {
    const { queryByText } = render(<CUT authUrl="http://auth" clientId="id" />);
    expect(queryByText(text)).toBeInTheDocument();
    expect(queryByText(text)).toHaveProperty(
      'href',
      helper('http://auth', 'id')
    );
  });
});
