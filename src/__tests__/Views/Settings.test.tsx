import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { render } from '@testing-library/react';

import mainReducer from '../../Reducers/main';
import ConnectedSettings from '../../Views/Settings';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const testTheme = createMuiTheme();

it('parsers query string on page load and stores settings in redux state', async (): Promise<
  void
> => {
  const store = createStore(mainReducer);
  const apiUrl = 'http://api.url';
  const title = 'TEST_TITLE';

  window.history.pushState(
    null,
    'title',
    `http://localhost/settings?apiUrl=${encodeURI(apiUrl)}&title=${title}`
  );

  render(
    <Provider store={store}>
      <ThemeProvider theme={testTheme}>
        <Router>
          <Route>
            <ConnectedSettings />
          </Route>
        </Router>
      </ThemeProvider>
    </Provider>
  );

  expect(store.getState().settings.apiUrl).toEqual(apiUrl);
  expect(store.getState().settings.title).toEqual(title);
});
