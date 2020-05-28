import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { App } from '../App';

jest.mock('chart.js');

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
