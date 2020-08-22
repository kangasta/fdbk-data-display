import React from 'react';
import { render } from '@testing-library/react';

import { Footer } from '../../Utils/Footer';

it.each([
  ['', '', ''],
  ['Version:  commit', 'commit', ''],
  ['Version: tag ', '', 'tag'],
  ['Version: tag 01234567', '0123456789', 'tag'],
])(
  'returns "%s" when COMMIT="%s" and TAG=%s',
  (expected, commit, tag): void => {
    process.env.COMMIT = commit;
    process.env.TAG = tag;

    const { container } = render(<Footer />);
    expect(container.textContent).toEqual(expected);
  }
);
