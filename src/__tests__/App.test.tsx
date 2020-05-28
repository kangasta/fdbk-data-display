import React from 'react';
import { render } from '@testing-library/react';

import { App } from '../App';

jest.mock('chart.js');

it('renders without crashing', (): void => {
  render(<App />);
});
