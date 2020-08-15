import React from 'react';
import { render } from '@testing-library/react';

import { AccountContainer } from '../../Components/AccountContainer';

// Name: Test Dude
const TEST_ID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ2l2ZW5fbmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IkR1ZGUiLCJpYXQiOjE1MTYyMzkwMjJ9.SRHYhnDAuP2qB1dHTo4-aCS8gO5nTpzZKEIKXdtMVdQ';

describe('AccountContainer', (): void => {
  it('displays users name when user is logged in (given_name family_name)', (): void => {
    const { container } = render(
      <AccountContainer
        authUrl="http://auth"
        clientId="id"
        idToken={TEST_ID_TOKEN}
      />
    );

    expect(container.textContent).toContain('Test Dude');
    expect(container.textContent).toContain('log out');
  });
  it('displays log in link when no active logins', (): void => {
    const { queryByText } = render(
      <AccountContainer authUrl="http://auth" clientId="id" />
    );

    expect(queryByText('Log in')).toBeInTheDocument();
  });
});
