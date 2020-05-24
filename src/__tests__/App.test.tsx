import React from 'react';
import { render } from '@testing-library/react';

import { App } from '../App';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import ChartJs, { ChartData, ChartOptions } from 'chart.js';
jest.mock('chart.js');

it('renders without crashing', (): void => {
  render(<App />);
});
