import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ThemeProvider, createMuiTheme } from '@material-ui/core';

import { TEST_ID_NAME, TEST_ID_TOKEN } from '../../setupTests';
import { AccountContainer } from '../../Components/AccountContainer';

const testTheme = createMuiTheme();

describe('AccountContainer', (): void => {
  it('displays users name when user is logged in (given_name family_name)', async (): Promise<
    void
  > => {
    const { container, findByText, findByTestId } = render(
      <ThemeProvider theme={testTheme}>
        <AccountContainer
          authUrl="http://auth"
          clientId="id"
          idToken={TEST_ID_TOKEN}
        />
      </ThemeProvider>
    );

    expect(container.textContent).toContain(TEST_ID_NAME);
    fireEvent.click(await findByTestId('account-menu-button'));
    await findByText('Log out');
  });
  it('displays log in link when no active logins', (): void => {
    const { queryByText } = render(
      <ThemeProvider theme={testTheme}>
        <AccountContainer authUrl="http://auth" clientId="id" />
      </ThemeProvider>
    );

    expect(queryByText('Log in')).toBeInTheDocument();
  });
});
