import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import {
  TEST_ID_NAME,
  TEST_ID_TOKEN,
  TestWrapper,
} from '../../Utils/testUtils';
import { AccountContainer } from '../../Components/AccountContainer';

describe('AccountContainer', (): void => {
  it('displays users name when user is logged in (given_name family_name)', async (): Promise<
    void
  > => {
    const { container, findByText, findByTestId } = render(
      <TestWrapper>
        <AccountContainer
          authUrl="http://auth"
          clientId="id"
          idToken={TEST_ID_TOKEN}
        />
      </TestWrapper>
    );

    expect(container.textContent).toContain(TEST_ID_NAME);
    fireEvent.click(await findByTestId('account-menu-button'));
    await findByText('Log out');
  });
  it('displays log in link when no active logins', (): void => {
    const { queryByText } = render(
      <TestWrapper>
        <AccountContainer authUrl="http://auth" clientId="id" />
      </TestWrapper>
    );

    expect(queryByText('Log in')).toBeInTheDocument();
  });
});
