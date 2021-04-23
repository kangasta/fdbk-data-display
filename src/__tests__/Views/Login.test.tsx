import React from 'react';
import { createStore } from 'redux';
import { render } from '@testing-library/react';

import { TEST_ID_TOKEN, TestWrapper } from '../../Utils/testUtils';
import mainReducer from '../../Reducers/main';
import ConnectedLogin from '../../Views/Login';
import { setSettings } from '../../Utils/actionCreators';

const settingsState = {
  apiUrl: 'http://api',
  authUrl: 'http://auth',
  clientId: 'asd',
};

it('stores login details on page load and clears them when they expire', (): void => {
  const store = createStore(mainReducer);
  store.dispatch(setSettings(settingsState));

  window.history.pushState(
    null,
    'title',
    `http://localhost/login#id_token=${TEST_ID_TOKEN}&access_token=ACCESS_TOKEN&expires_in=3600&token_type=Bearer`
  );

  render(
    <TestWrapper store={store}>
      <ConnectedLogin />
    </TestWrapper>
  );

  expect(store.getState().authentication?.id_token).toEqual(TEST_ID_TOKEN);
  expect(store.getState().authentication?.expires_in).toEqual(3600);

  jest.advanceTimersByTime(3600e3);
  expect(store.getState().authentication).toBeNull();
});

it('shows error if url does not contain tokens', async (): Promise<void> => {
  const store = createStore(mainReducer);

  window.history.pushState(null, 'title', `http://localhost/login`);

  const { container, findByTestId } = render(
    <TestWrapper store={store}>
      <ConnectedLogin />
    </TestWrapper>
  );

  await findByTestId('error-container');
  expect(container.textContent).toContain('Did not receive credentials');
});
