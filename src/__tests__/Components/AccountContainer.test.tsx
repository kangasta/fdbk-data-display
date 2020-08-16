import React from 'react';
import { render } from '@testing-library/react';

import { TEST_ID_NAME, TEST_ID_TOKEN } from '../../setupTests';
import { AccountContainer } from '../../Components/AccountContainer';

describe('AccountContainer', (): void => {
  it('displays users name when user is logged in (given_name family_name)', (): void => {
    const { container } = render(
      <AccountContainer
        authUrl="http://auth"
        clientId="id"
        idToken={TEST_ID_TOKEN}
      />
    );

    expect(container.textContent).toContain(TEST_ID_NAME);
    expect(container.textContent).toContain('log out');
  });
  it('displays log in link when no active logins', (): void => {
    const { queryByText } = render(
      <AccountContainer authUrl="http://auth" clientId="id" />
    );

    expect(queryByText('Log in')).toBeInTheDocument();
  });
});
