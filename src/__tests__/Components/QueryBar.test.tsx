import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react';

import { getKeyUpEvent } from '../../setupTests';
import mainReducer from '../../Reducers/main';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import QueryBar from '../../Components/QueryBar';

const testTheme = createMuiTheme();

it('allows setting timeframe for data query', async (): Promise<void> => {
  const store = createStore(mainReducer);

  const { findByLabelText, findByText } = render(
    <Provider store={store}>
      <ThemeProvider theme={testTheme}>
        <QueryBar />
      </ThemeProvider>
    </Provider>
  );
  expect(store.getState().query.mode).toEqual('From now');

  fireEvent.click(await findByText('Month'));
  fireEvent.keyUp(await findByLabelText('Year'), getKeyUpEvent('1999'));
  expect(store.getState().query.mode).toEqual('Month');
  expect(store.getState().query.year).toEqual(1999);

  fireEvent.click(await findByText('Query string'));
  fireEvent.keyUp(
    await findByLabelText('Query string'),
    getKeyUpEvent('animal=cow')
  );
  expect(store.getState().query.mode).toEqual('Query string');
  expect(store.getState().query.queryString).toEqual('animal=cow');
});
