import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { App } from '../App';

jest.mock('chart.js');

const getInvalidResponse = (status = 200) =>
  Promise.resolve(
    new Response(JSON.stringify({ error: 'Test invalid response.' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );

it('renders without crashing', (): void => {
  render(<App />);
});

it('has darkmode toggle', async (): Promise<any> => {
  const { findByTestId } = render(<App />);
  const darkmodeToggle = await findByTestId('darkmode-toggle-button');

  expect(document.body).toHaveStyle('background-color: #fafafa');

  fireEvent.click(darkmodeToggle);
  expect(document.body).toHaveStyle('background-color: #303030');

  fireEvent.click(darkmodeToggle);
  expect(document.body).toHaveStyle('background-color: #fafafa');
});

it('shows error message when API URL is not configured', async (): Promise<
  any
> => {
  const { findByTestId } = render(<App />);
  const errorContainer = await findByTestId('error-container');
  expect(errorContainer.textContent).toContain('API not configured');
});

it('allows configuring API URL and shows error message on invalid response from API', async (): Promise<
  any
> => {
  const fetchSpy = jest
    .spyOn(window, 'fetch')
    .mockReturnValue(getInvalidResponse());
  const testApi = 'http://api_test_url/';
  const { container, findByTestId, findByText } = render(<App />);

  const settingsToggle = await findByTestId('settings-view-toggle-button');
  await fireEvent.click(settingsToggle);

  await findByText('Statistics URL');
  const urlField = container.querySelector('input[name="apiUrl"]');
  await fireEvent.keyUp(urlField!, {
    key: 'Enter',
    target: { value: testApi },
  });
  await fireEvent.click(settingsToggle);

  const errorContainer = await findByTestId('error-container');
  expect(errorContainer.textContent).toContain(
    'No statistics data in the response'
  );
  expect(fetchSpy).toHaveBeenCalledWith(testApi, expect.anything());
});
