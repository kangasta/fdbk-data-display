import React from 'react';
import { connect } from 'react-redux';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { StatisticContainer } from '../Utils/StatisticContainer';
import { capitalize } from '../Utils/Page';
import { ListPayload, TablePayload } from '../Types/Statistics';
import { getElementTitle, getTableElement } from '../Utils/CollectionElements';
import { StateType } from '../Reducers/main';

export const getTableKey = ({ name }: TablePayload): string => `${name}-table`;

const getTableTitles = (
  row: ListPayload,
  singleCellValues = true
): string[] => [
  ...new Set(row.data.map((i) => getElementTitle(i, singleCellValues))),
  'Name',
];

const getTableRow = (
  row: ListPayload,
  decimals = 2,
  singleCellValues = true
): React.ReactNode => {
  const columnsMap: { [key: string]: React.ReactNode[] } = {
    Name: [<span key="Name">{capitalize(row.name)}</span>],
  };

  row.data.forEach((i) => {
    const column = getElementTitle(i, singleCellValues);
    if (!Object.keys(columnsMap).includes(column)) {
      columnsMap[column] = [getTableElement(i, decimals, singleCellValues)];
    } else {
      columnsMap[column].push(getTableElement(i, decimals, singleCellValues));
    }
  });

  return (
    <TableRow key={row.name}>
      {getTableTitles(row, singleCellValues).map((i) => (
        <TableCell key={i}>{columnsMap[i]}</TableCell>
      ))}
    </TableRow>
  );
};

export interface TableContainerProps {
  name: string;
  data: TablePayload['data'];
  decimals?: number;
  singleCellValues?: boolean;
}

export const TableContainer = ({
  name,
  data,
  decimals = 2,
  singleCellValues,
}: TableContainerProps): React.ReactElement => (
  <StatisticContainer title={name}>
    <Table>
      <TableHead>
        <TableRow>
          {getTableTitles(data[0], singleCellValues).map((i) => (
            <TableCell key={i}>{capitalize(i)}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((i) => getTableRow(i, decimals, singleCellValues))}
      </TableBody>
    </Table>
  </StatisticContainer>
);

const mapStateToProps = ({ settings }: StateType) => ({
  singleCellValues: settings.tableSingleCellValues,
  decimals: settings.tableDecimals,
});

export default connect(mapStateToProps)(TableContainer);
