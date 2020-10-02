import React, { useState, useEffect } from 'react';

import { ChartData } from 'chart.js';

import { ChartContainer } from '../Components/ChartContainer';
import ListContainer from '../Components/ListContainer';
import TableContainer from '../Components/TableContainer';
import { ListPayload, TablePayload } from '../Types/Statistics';

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

export const DemoCharts = (): React.ReactElement => {
  const [doughnutValues, setDoughnutValues] = useState<number[]>(
    getRandomNumbers(4)
  );
  const [lineValues, setLineValues] = useState<TimePoint[][]>([[], [], [], []]);

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
    <>
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
    </>
  );
};

export const DemoListPayload: ListPayload = {
  data: [
    {
      payload: {
        field: 'status',
        status: 'SUCCESS',
        topic_name: 'Example',
      },
      type: 'status',
    },
    {
      payload: {
        field: 'numeric_value',
        topic_name: 'Example',
        type: 'min',
        value: 1.23456789,
      },
      type: 'value',
    },
    {
      payload: {
        field: 'numeric_value',
        topic_name: 'Example',
        type: 'max',
        value: 9.87654321,
      },
      type: 'value',
    },
  ],
  name: 'List',
};

export const DemoList = (): React.ReactElement => (
  <ListContainer {...DemoListPayload} />
);

export const getDemoTablePayload = (
  statuses: string[],
  offset = 0
): TablePayload => ({
  data: statuses.map(
    (name: string, i: number): ListPayload => ({
      data: [
        {
          payload: {
            field: 'status',
            status: name,
            topic_name: name,
          },
          type: 'status',
        },
        {
          payload: {
            field: 'value',
            topic_name: name,
            type: 'latest',
            unit: 'unit',
            value: 'value',
          },
          type: 'value',
        },
        {
          payload: {
            field: 'numeric_value',
            topic_name: name,
            type: 'latest',
            value: i + offset,
          },
          type: 'value',
        },
        {
          payload: {
            field: 'numeric_value',
            topic_name: name,
            type: 'average',
            value: i + offset,
          },
          type: 'value',
        },
      ],
      name,
    })
  ),
  name: 'Table',
});
export const DemoTablePayload = getDemoTablePayload(
  ['Success', 'Warning', 'Error', 'Info', 'Unknown status'],
  0.123456789
);

export const DemoTable = (): React.ReactElement => (
  <TableContainer {...DemoTablePayload} />
);
