import React from 'react';

import { Chart } from 're-chartjs-wrapper';
import {
  ChartOptions,
  ChartScales,
  ChartType,
  ChartData,
  ChartTooltipItem,
} from 'chart.js';
import 'chartjs-plugin-colorschemes';

import { useMediaQuery } from '@material-ui/core';
import { Theme, useTheme } from '@material-ui/core/styles';

import { getDownQuery } from '../Utils/ThemeWrapper';
import { StatisticContainer } from '../Utils/StatisticContainer';

const getChartColors = (theme: Theme): string[] => [
  theme.palette.info.main,
  theme.palette.error.main,
  theme.palette.success.main,
  theme.palette.warning.main,
  theme.palette.primary.main,
  theme.palette.secondary.main,
];

const getAspectRatio = (downSm: boolean, downXs: boolean): number => {
  if (downXs) {
    return 1.25;
  } else if (downSm) {
    return 2.0;
  }
  return 2.75;
};

const getCommonChartOptions = (
  theme: Theme,
  aspectRatio = 2.75
): ChartOptions => ({
  plugins: {
    colorschemes: {
      fillAlpha: 0.0,
      custom: () => getChartColors(theme),
    },
  },
  legend: {
    position: 'bottom',
    labels: {
      fontColor: theme.palette.text.secondary,
    },
  },
  aspectRatio,
  tooltips: {
    callbacks: {
      label: getRoundedLabel,
    },
    multiKeyBackground: 'transparent',
  },
  elements: {
    arc: {
      borderColor: theme.palette.background.paper,
    },
  },
});

const getGridStyling = (theme: Theme): ChartScales => ({
  gridLines: {
    color: theme.palette.text.hint,
    lineWidth: 0.5,
    zeroLineColor: theme.palette.text.primary,
    zeroLineWidth: 2,
  },
  ticks: {
    fontColor: theme.palette.text.secondary,
  },
});

const getRoundedLabel = (tooltipItem: ChartTooltipItem, data: ChartData) => {
  const index = tooltipItem.index === undefined ? -1 : tooltipItem.index;
  const datasetIndex =
    tooltipItem.datasetIndex === undefined ? -1 : tooltipItem.datasetIndex;

  const label =
    data.datasets?.[datasetIndex]?.label || data.labels?.[index] || '';

  const raw_value = tooltipItem.yLabel
    ? Number(tooltipItem.yLabel)
    : Number(data?.datasets?.[datasetIndex]?.data?.[index]);
  const value = Math.round((raw_value || 0) * 100) / 100;

  return ` ${label}${label ? ': ' : ''}${value}`;
};

const getLineChartOptions = (theme: Theme): ChartOptions => ({
  scales: {
    xAxes: [
      {
        type: 'time',
        ...getGridStyling(theme),
      },
    ],
    yAxes: [
      {
        ...getGridStyling(theme),
      },
    ],
  },
});

export const getChartOptions = (
  type: ChartType,
  theme: Theme,
  aspectRatio = 2.75
): ChartOptions => {
  switch (type) {
    case 'line':
      return {
        ...getCommonChartOptions(theme, aspectRatio),
        ...getLineChartOptions(theme),
      };
    default:
      return getCommonChartOptions(theme, aspectRatio);
  }
};

export const getChartKey = ({
  field,
  type,
}: {
  field: string;
  type: string;
}): string => `${field}-${type}`;

export interface ChartContainerProps {
  field: string;
  type: ChartType;
  data: ChartData;
}

export const ChartContainer = ({
  field,
  type,
  data,
}: ChartContainerProps): React.ReactElement => {
  const theme = useTheme();

  const downSm = useMediaQuery(getDownQuery('sm'));
  const downXs = useMediaQuery(getDownQuery('xs'));

  return (
    <StatisticContainer title={field}>
      <Chart
        key={`${getChartKey({ field, type })}-${getAspectRatio(
          downSm,
          downXs
        )}`}
        data={data}
        type={type}
        options={getChartOptions(type, theme, getAspectRatio(downSm, downXs))}
      />
    </StatisticContainer>
  );
};
