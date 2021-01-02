import React from 'react';
import { render } from '@testing-library/react';

import { DataDetailContent } from '../../Utils/DataPresentation';

/* eslint-disable @typescript-eslint/no-var-requires */
const CONSOLE_TXT =
  '+ python -u process_simulator.py\nStarting the process\nProcess completed';
const CONSOLE_JSON = require('./console_output.json');
/* eslint-enable @typescript-eslint/no-var-requires */

it.each([['timestamp'], ['iso_8601']])(
  'replaces timestamps with relative time (%s)',
  (unit: string): void => {
    const timestampStr = '2021-01-02T14:11:52.534231Z';
    const props = { value: timestampStr, unit };
    const { getByTitle } = render(<DataDetailContent {...props} />);
    const timestamp = getByTitle(timestampStr);
    expect(timestamp.textContent).not.toEqual(timestamp);
  }
);

it('renders plain text console', (): void => {
  const props = { value: CONSOLE_TXT, unit: 'console' };
  const { container } = render(<DataDetailContent {...props} />);
  expect(container.textContent).toEqual(CONSOLE_TXT);
});

it('renders json console', (): void => {
  const props = { value: CONSOLE_JSON, unit: 'console' };
  const { container } = render(<DataDetailContent {...props} />);
  expect(container.textContent).toContain(`+ ${CONSOLE_JSON[0].text}`);
  expect(container.textContent).toContain('14:12:10.999');
});

it('does not crash on invalid json console', (): void => {
  const props = { value: [{}], unit: 'console' };
  render(<DataDetailContent {...props} />);
});
