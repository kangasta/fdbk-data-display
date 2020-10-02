import React from 'react';
import { connect } from 'react-redux';

import { List } from '@material-ui/core';

import { StatisticContainer } from '../Utils/StatisticContainer';
import { ListPayload } from '../Types/Statistics';
import { getListElement } from '../Utils/CollectionElements';
import { StateType } from '../Reducers/main';

export const getListKey = ({ name }: ListPayload): string => `${name}-list`;

export interface ListContainerProps {
  name: string;
  data: ListPayload['data'];
  decimals?: number;
}

export const ListContainer = ({
  name,
  data,
  decimals = 2,
}: ListContainerProps): React.ReactElement => (
  <StatisticContainer title={name}>
    <List disablePadding>{data.map((i) => getListElement(i, decimals))}</List>
  </StatisticContainer>
);

const mapStateToProps = ({ settings }: StateType) => ({
  decimals: settings.tableDecimals,
});

export default connect(mapStateToProps)(ListContainer);
