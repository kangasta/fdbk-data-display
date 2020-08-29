import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { render, fireEvent } from '@testing-library/react';

import { getKeyUpEvent } from '../../setupTests';
import mainReducer from '../../Reducers/main';
import ConnectedSettings from '../../Views/Settings';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const testTheme = createMuiTheme();

interface ValueType {
  label: string;
  value: string | number | boolean | undefined;
}
const DATA: { [key: string]: ValueType } = {
  apiUrl: { label: 'Statistics URL', value: 'http://api.url' },
  title: { label: 'Page title', value: 'TEST_TITLE' },
  limit: { label: 'Limit', value: 100 },
  showQueryBar: { label: 'Display query bar', value: false },
};

const URL = `/settings?apiUrl=${encodeURI(String(DATA.apiUrl.value))}&title=${
  DATA.title.value
}&limit=${DATA.limit.value}&showQueryBar=${DATA.showQueryBar.value}`;

it('parsers query string on page load and stores settings in redux state', async (): Promise<
  void
> => {
  const store = createStore(mainReducer);

  window.history.pushState(null, 'title', `http://localhost${URL}`);

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

  expect(store.getState().settings.apiUrl).toEqual(DATA.apiUrl.value);
  expect(store.getState().settings.title).toEqual(DATA.title.value);
  expect(store.getState().settings.limit).toEqual(DATA.limit.value);
  expect(store.getState().settings.showQueryBar).toEqual(
    DATA.showQueryBar.value
  );
});

it('allows sharing link to current settings', async (): Promise<void> => {
  const store = createStore(mainReducer);
  const clipboardSpy = jest.spyOn(navigator.clipboard, 'writeText');

  const { container, findByLabelText, findByTestId } = render(
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

  const values = Object.values(DATA);
  for (let i = 0; i < values.length; i++) {
    const { label, value } = values[i];

    if (typeof value === 'boolean') {
      fireEvent.click(await findByLabelText(label));
    }
    fireEvent.keyUp(await findByLabelText(label), getKeyUpEvent(String(value)));
  }

  await act(async () => {
    fireEvent.click(await findByTestId('copy-link-button'));
  });

  expect(container.textContent).toContain('Copied link to clipboard');

  const callParameter = clipboardSpy.mock.calls[0][0];
  Object.keys(DATA).forEach((key) => {
    expect(callParameter).toContain(`${key}=${DATA[key].value}`);
  });
});
