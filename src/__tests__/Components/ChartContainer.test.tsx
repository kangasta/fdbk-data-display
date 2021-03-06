import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ChartData, ChartTooltipItem, ChartType } from 'chart.js';

import { render } from '@testing-library/react';

import {
  getChartOptions,
  ChartContainer,
  getChartKey,
} from '../../Components/ChartContainer';

jest.mock('chart.js');

const testTheme = createMuiTheme();

describe('ChartContainer', (): void => {
  it('capitalizes field name', (): void => {
    const { queryByText } = render(
      <ThemeProvider theme={testTheme}>
        <ChartContainer field="test" type="line" data={{}} />
      </ThemeProvider>
    );

    expect(queryByText('test')).not.toBeInTheDocument();
    expect(queryByText('Test')).toBeInTheDocument();
  });
});

describe('getChartKey', (): void => {
  it('returns field-type string', (): void => {
    expect(getChartKey({ field: 'testField', type: 'testType' })).toEqual(
      'testField-testType'
    );
  });
});

describe('getChartOptions', (): void => {
  it.each([['line'], ['pie']])(
    'rounds labels to two digits for %s chart',
    (type: string): void => {
      const options = getChartOptions(type as ChartType, testTheme);

      const testData: ChartData = { datasets: [{ label: 'test label' }] };
      const testTooltip: ChartTooltipItem = { datasetIndex: 0, yLabel: 0.005 };

      const callback = options.tooltips?.callbacks?.label;
      expect(callback && callback(testTooltip, testData)).toEqual(
        ' test label: 0.01'
      );
    }
  );
  it('omits empty label', (): void => {
    const options = getChartOptions('line' as ChartType, testTheme);
    const callback = options.tooltips?.callbacks?.label;
    expect(callback && callback({}, {})).toEqual(' 0');
  });
});
