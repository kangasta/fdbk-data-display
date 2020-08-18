import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import { render } from '@testing-library/react';

import { TEST_ID_TOKEN } from '../../setupTests';
import mainReducer from '../../Reducers/main';
import ConnectedStatistics from '../../Views/Statistics';
import { setAuthentication, setSettings } from '../../Utils/actionCreators';

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

const testTheme = createMuiTheme();

it('clears authentication on failed fetch', async (): Promise<any> => {
  const fetchSpy = jest
    .spyOn(window, 'fetch')
    .mockImplementation(() => rejectIn(2500));

  const store = createStore(mainReducer);
  store.dispatch(setAuthentication(authenticationState));
  store.dispatch(setSettings(settingsState));

  const { findByTestId } = render(
    <Provider store={store}>
      <ThemeProvider theme={testTheme}>
        <ConnectedStatistics />
      </ThemeProvider>
    </Provider>
  );

  expect(fetchSpy).toHaveBeenCalled();
  expect(store.getState().authentication).toBeTruthy();

  jest.runAllTimers();
  await findByTestId('error-container');
  expect(store.getState().authentication).toBeNull();
});
