import React, { useState, useEffect } from 'react';

import { Typography } from '@material-ui/core';

import { ChartData } from 'chart.js';
import ChartContainer from '../Components/ChartContainer';

import { Page } from '../Utils/Page';

const LABELS = ['Blue', 'Red', 'Green', 'Orange'];
const UPDATE_INTERVAL = 10e3;

const getDoughnutData = (data: number[]): ChartData => ({
  datasets: [
    {
      data,
    },
  ],
  labels: LABELS,
});

type TimePoint = { x: string; y: number };
const getLineData = (data: TimePoint[][]): ChartData => ({
  datasets: data.map((data, i) => ({
    data: data.slice(-15),
    label: LABELS[i],
  })),
});

const getRandomNumbers = (N: number, max = 10): number[] =>
  [...Array(N)].map(() => Math.random() * max);
const getRandomNumberWithTimestamp = (
  time = Date.now(),
  max = 10
): { x: string; y: number } => ({
  x: new Date(time).toISOString(),
  y: Math.random() * max,
});

export const GettingStarted = (): React.ReactElement => {
  const [doughnutValues, setDoughnutValues] = useState<number[]>(
    getRandomNumbers(4)
  );
  const [lineValues, setLineValues] = useState<TimePoint[][]>([[], [], [], []]); // LABELS.map(() => [getRandomNumberWithTimestamp()])

  useEffect(() => {
    const randomizeDoughnut = () => setDoughnutValues(getRandomNumbers(4));
    const addLineData = (time = Date.now()) =>
      setLineValues((data) =>
        data.map((values) => [...values, getRandomNumberWithTimestamp(time)])
      );

    for (let i = -10; i <= 0; i++) {
      addLineData(Date.now() + i * UPDATE_INTERVAL);
    }

    const doughnutInterval = setInterval(randomizeDoughnut, UPDATE_INTERVAL);
    const lineInterval = setInterval(addLineData, UPDATE_INTERVAL);

    return () => {
      clearInterval(doughnutInterval);
      clearInterval(lineInterval);
    };
  }, [setDoughnutValues, setLineValues]);

  return (
    <Page>
      <Typography variant="h5" component="h2">
        Getting started
      </Typography>
      <p>
        Hello!{' '}
        <span role="img" aria-label="waving hand">
          👋
        </span>
      </p>
      <p>
        You are seeing this demo page because this data display has not been
        configured to fetch data from any API. In order to configure API and
        authentication for this data display, navigate to the settings page.
        Alternatively, if you are the admin of this page, you can configure the
        default settings through a <code>config.js</code> file. This{' '}
        <code>config.js</code> file should be located in the same directory as
        the <code>index.html</code>.
      </p>
      <p>If you are here to see the demo charts, kick back and relax.</p>
      <ChartContainer
        field="Pie chart"
        type="doughnut"
        data={getDoughnutData(doughnutValues)}
      />
      <ChartContainer
        field="Line chart"
        type="line"
        data={getLineData(lineValues)}
      />
    </Page>
  );
};
