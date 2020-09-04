import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { createMatchMedia } from '../setupTests';
import { getKeyUpEvent } from '../Utils/testUtils';

import { App } from '../App';

jest.mock('chart.js');

const getInvalidResponse = (status = 200) =>
  Promise.resolve(
    new Response(JSON.stringify({ error: 'Test invalid response.' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );

const changeInputValue = async (
  label: string,
  value: string
): Promise<void> => {
  const field = await screen.findByLabelText(label);
  await fireEvent.keyUp(field, getKeyUpEvent(value));
};

it('renders without crashing', (): void => {
  render(<App />);
});

it('has darkmode toggle', async (): Promise<void> => {
  const { findByTestId } = render(<App />);
  const darkmodeToggle = await findByTestId('darkmode-toggle-button');

  expect(document.body).toHaveStyle('background-color: #fafafa');

  fireEvent.click(darkmodeToggle);
  expect(document.body).toHaveStyle('background-color: #303030');

  fireEvent.click(darkmodeToggle);
  expect(document.body).toHaveStyle('background-color: #fafafa');
});

it('shows getting started page when API URL is not configured', async (): Promise<
  void
> => {
  const { findByText } = render(<App />);
  await findByText('Getting started');
});

it('allows configuring API URL and shows error message on invalid response from API', async (): Promise<
  void
> => {
  const fetchSpy = jest
    .spyOn(window, 'fetch')
    .mockReturnValue(getInvalidResponse());
  const testApi = 'http://api_test_url/';
  const { findByTestId } = render(<App />);

  const settingsToggle = await findByTestId('settings-view-toggle-button');
  await fireEvent.click(settingsToggle);

  await changeInputValue('Statistics URL', testApi);
  await fireEvent.click(await screen.findByLabelText('Display query bar'));
  await fireEvent.click(settingsToggle);

  const errorContainer = await findByTestId('error-container');
  expect(errorContainer.textContent).toContain(
    'No statistics data in the response'
  );
  expect(fetchSpy).toHaveBeenCalledWith(testApi, expect.anything());
});

it('allows setting page title in settings', async (): Promise<void> => {
  const testTitle = 'TEST_TITLE';
  const { container, findByTestId, findByText } = render(<App />);
  expect(container.textContent).not.toContain(testTitle);

  const settingsToggle = await findByTestId('settings-view-toggle-button');
  await fireEvent.click(settingsToggle);
  await changeInputValue('Page title', testTitle);

  await fireEvent.click(settingsToggle);
  const title = await findByText(testTitle);
  expect(title.tagName).toEqual('H1');

  await fireEvent.click(settingsToggle);
  await changeInputValue('Page title', '');
  expect(container.textContent).not.toContain(testTitle);
});

it('hides menu items in speed dial on small screens', async (): Promise<
  void
> => {
  window.matchMedia = createMatchMedia(500);
  const { findByTestId } = render(<App />);

  const settingsToggle = await findByTestId('settings-view-toggle-button');
  expect(settingsToggle).toHaveClass('MuiSpeedDialAction-fabClosed');

  const menuToggle = await findByTestId('menu-toggle-button');
  await fireEvent.click(menuToggle);
  expect(settingsToggle).not.toHaveClass('MuiSpeedDialAction-fabClosed');

  await fireEvent.click(menuToggle);
  expect(settingsToggle).toHaveClass('MuiSpeedDialAction-fabClosed');
});
