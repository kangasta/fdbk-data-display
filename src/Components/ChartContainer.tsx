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

import {
  Typography,
  Theme,
  useTheme,
  makeStyles,
  createStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(3),
    },
    container: {
      position: 'relative',
      marginBottom: theme.spacing(6),
    },
  })
);

const getChartColors = (theme: Theme): string[] => [
  theme.palette.info.main,
  theme.palette.error.main,
  theme.palette.success.main,
  theme.palette.warning.main,
];

const getCommonChartOptions = (theme: Theme): ChartOptions => ({
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
  aspectRatio: 2.75,
  tooltips: {
    callbacks: {
      label: getRoundedLabel,
    },
    multiKeyBackground: 'transparent',
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
  const datasetIndex =
    tooltipItem.datasetIndex === undefined ? -1 : tooltipItem.datasetIndex;
  const label = data.datasets?.[datasetIndex]?.label || '';
  const value = Math.round((Number(tooltipItem.yLabel) || 0) * 100) / 100;
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
  theme: Theme
): ChartOptions => {
  switch (type) {
    case 'line':
      return {
        ...getCommonChartOptions(theme),
        ...getLineChartOptions(theme),
      };
    default:
      return getCommonChartOptions(theme);
  }
};

export const getChartKey = ({
  field,
  type,
}: {
  field: string;
  type: string;
}): string => `${field}-${type}`;

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

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
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h5" component="h2">
        {capitalize(field)}
      </Typography>
      <Chart
        key={getChartKey({ field, type })}
        data={data}
        type={type}
        options={getChartOptions(type, theme)}
      />
    </div>
  );
};

export default ChartContainer;
