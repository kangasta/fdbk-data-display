import React from 'react';
import { createStore } from 'redux';

import { render } from '@testing-library/react';

import { TEST_ID_TOKEN, TestWrapper } from '../../Utils/testUtils';
import mainReducer from '../../Reducers/main';
import ConnectedStatistics from '../../Views/Statistics';
import { setAuthentication, setSettings } from '../../Utils/actionCreators';

const WARNINGS_DATA = {
  warnings: ['Test warning'],
  statistics: [],
};

const rejectIn = (milliseconds: number, reason?: any): Promise<any> =>
  new Promise((_, reject) => setTimeout(() => reject(reason), milliseconds));

const settingsState = {
  apiUrl: 'http://api',
  authUrl: 'http://auth',
  clientId: 'asd',
};

const authenticationState = {
  id_token: TEST_ID_TOKEN,
  access_token: 'ACCESS_TOKEN',
  expires_in: 3600,
  token_type: 'Bearer',
};

it('clears authentication on failed fetch', async (): Promise<void> => {
  const fetchSpy = jest
    .spyOn(window, 'fetch')
    .mockImplementation(() => rejectIn(2500));

  const store = createStore(mainReducer);
  store.dispatch(setAuthentication(authenticationState));
  store.dispatch(setSettings(settingsState));

  const { findByTestId } = render(
    <TestWrapper store={store}>
      <ConnectedStatistics />
    </TestWrapper>
  );

  expect(fetchSpy).toHaveBeenCalled();
  expect(store.getState().authentication).toBeTruthy();

  jest.runAllTimers();
  await findByTestId('error-container');
  expect(store.getState().authentication).toBeNull();
});

it('renders warnings', async (): Promise<void> => {
  const fetchSpy = jest
    .spyOn(window, 'fetch')
    .mockImplementation(() =>
      Promise.resolve({ json: () => Promise.resolve(WARNINGS_DATA) } as any)
    );
  const store = createStore(mainReducer);
  store.dispatch(setSettings(settingsState));

  const { findByText } = render(
    <TestWrapper store={store}>
      <ConnectedStatistics />
    </TestWrapper>
  );

  expect(fetchSpy).toHaveBeenCalled();

  await findByText('Test warning');
  await findByText('No data available');
});
