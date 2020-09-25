import React from 'react';
import { render } from '@testing-library/react';

import {
  TestWrapper,
} from '../../Utils/testUtils';

import {
  TableContainer,
  getTableKey,
} from '../../Components/TableContainer';
import { TablePayload } from '../../Types/Statistics';
import { getDemoTablePayload } from '../../Utils/Demo';

const OFFSET = 0.12345;
const TEST_DATA = getDemoTablePayload(['Success', 'not_supported'], OFFSET).data;

const getOffsetStr = (decimals=2): string => String(OFFSET).slice(0, decimals ? 2 + decimals : 1);

describe('TableContainer', (): void => {
  it('capitalizes field names', (): void => {
    const { queryByText } = render(
      <TestWrapper>
        <TableContainer name="test_table" data={TEST_DATA} />
      </TestWrapper>
    );

    expect(queryByText('test_table')).not.toBeInTheDocument();
    expect(queryByText('Test table')).toBeInTheDocument();

    expect(queryByText('numeric_value')).not.toBeInTheDocument();
    expect(queryByText('Numeric value')).toBeInTheDocument();
  });
  it('renders status as icon', (): void => {
    const { getByTitle } = render(
      <TestWrapper>
        <TableContainer name="test_table" data={TEST_DATA} />
      </TestWrapper>
    );

    getByTitle('Not supported');
    const statusCell = getByTitle('Success');
    expect(statusCell.textContent).not.toContain('Success');
  });
  it.each([[0],[1],[2], [undefined]])('rounds numeric values to two given number of decimals (%s)', (decimals): void => {
    const { queryByText } = render(
      <TestWrapper>
        <TableContainer name="test_table" data={TEST_DATA} decimals={decimals}/>
      </TestWrapper>
    );

    expect(queryByText(getOffsetStr(decimals))).toBeInTheDocument();
    // Default value for decimals should be 2
    expect(queryByText(getOffsetStr((decimals || 2) + 1))).not.toBeInTheDocument();
  });
});

describe('getTableKey', (): void => {
  it('returns name-type string', (): void => {
    expect(getTableKey({ name: 'TEST_NAME' } as TablePayload)).toEqual(
      'TEST_NAME-table'
    );
  });
});
