import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { StatisticContainer, capitalize } from '../Utils/StatisticContainer';
import { ListPayload, TablePayload } from '../Types/Statistics';
import { getTableElement } from '../Utils/CollectionElements';

export const getTableKey = ({ name }: TablePayload): string => `${name}-table`;

const getTableTitles = (row: ListPayload): string[] => [
  ...new Set(row.data.map((i) => i.payload.field)),
  'Name',
];

const getTableRow = (row: ListPayload, decimals=2): React.ReactNode => {
  const columnsMap: { [key: string]: React.ReactNode[] } = {
    Name: [<span key="Name">{row.name}</span>],
  };

  row.data.forEach((i) => {
    if (!Object.keys(columnsMap).includes(i.payload.field)) {
      columnsMap[i.payload.field] = [getTableElement(i, decimals)];
    } else {
      columnsMap[i.payload.field].push(getTableElement(i, decimals));
    }
  });

  return (
    <TableRow key={row.name}>
      {getTableTitles(row).map((i) => (
        <TableCell key={i}>{columnsMap[i]}</TableCell>
      ))}
    </TableRow>
  );
};

export interface TableContainerProps extends Pick<TablePayload, 'name' | 'data'> {
  decimals?: number
}

export const TableContainer = ({
  name,
  data,
  decimals=2,
}: TableContainerProps): React.ReactElement => (
  <StatisticContainer title={name}>
    <Table>
      <TableHead>
        <TableRow>
          {getTableTitles(data[0]).map((i) => (
            <TableCell key={i}>{capitalize(i)}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>{data.map((i) => getTableRow(i, decimals))}</TableBody>
    </Table>
  </StatisticContainer>
);
