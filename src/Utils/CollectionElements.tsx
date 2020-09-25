import React from 'react';

import { Theme, styled } from '@material-ui/core/styles';
import {
  CheckCircle,
  Warning,
  Report,
  Info,
  Help,
  SvgIconComponent,
} from '@material-ui/icons';
import { Tooltip, TooltipProps } from '@material-ui/core';

import { ListPayload, Status, Value } from '../Types/Statistics';
import { capitalize } from './StatisticContainer';

type Element = ListPayload['data'][number];

interface StatusDetails {
  Icon: SvgIconComponent;
  getColor: (theme: Theme) => string;
}

const statusDetailsMap: { [key: string]: StatusDetails } = {
  success: {
    Icon: CheckCircle,
    getColor: (theme: Theme) => theme.palette.success.main,
  },
  warning: {
    Icon: Warning,
    getColor: (theme: Theme) => theme.palette.warning.main,
  },
  error: { Icon: Report, getColor: (theme: Theme) => theme.palette.error.main },
  info: { Icon: Info, getColor: (theme: Theme) => theme.palette.info.main },
};
const unknownStatusDetails = {
  Icon: Help,
  getColor: (theme: Theme) => theme.palette.text.secondary,
};
const getStatusDetails = (status: Status): StatusDetails =>
  statusDetailsMap[status.payload.status.toLowerCase()] || unknownStatusDetails;

export interface StatusIconProps extends Partial<TooltipProps> {
  status: Status;
}
export const StatusIcon = ({
  status,
  ...props
}: StatusIconProps): React.ReactElement => {
  const { Icon } = getStatusDetails(status);

  return (
    <Tooltip {...props} title={capitalize(status.payload.status)}>
      <Icon color="inherit" fontSize="inherit" />
    </Tooltip>
  );
};

const TableStatus = styled(StatusIcon)(
  ({ status, theme }: { status: Status; theme: Theme }) => ({
    color: getStatusDetails(status).getColor(theme),
    fontSize: '2em',
    marginRight: theme.spacing(1.5),
    verticalAlign: 'inherit',
  })
);

const ValueSpan = styled('span')(({ theme }: { theme: Theme }) => ({
  marginRight: theme.spacing(1.5),
}));

const UnitSpan = styled('span')(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(-1),
  marginRight: theme.spacing(1.5),
}));

const roundTo = (i: number, decimals: number) =>
  Math.round(i * 10 ** decimals) / 10 ** decimals;

const getValue = ({ payload }: Value, decimals = 2): string => {
  const { value } = payload;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }
  return String(roundTo(numeric, decimals));
};

export const getElementTitle = (
  element: Element,
  singleCellValues: boolean
): string => {
  if (singleCellValues) {
    return element.payload.field;
  }

  if (element.type == 'status') {
    return `${element.payload.field} (status)`;
  }

  return `${element.payload.field} (${element.payload.type})`;
};

export interface TableValueProps {
  value: Value;
  decimals: number;
  singleCellValues: boolean;
}
export const TableValue = ({
  value,
  decimals,
  singleCellValues,
}: TableValueProps): React.ReactElement => (
  <>
    <ValueSpan>{getValue(value, decimals)} </ValueSpan>
    {value.payload.unit && <UnitSpan>{String(value.payload.unit)} </UnitSpan>}
    {singleCellValues && value.payload.type !== 'latest' && (
      <UnitSpan>{String(`(${value.payload.type})`)} </UnitSpan>
    )}
  </>
);

export const getValueKey = ({ payload }: Element): string =>
  `${payload.topic_name}-${payload.field}-${payload.type}-value`;
export const getStatusKey = ({ payload }: Element): string =>
  `${payload.topic_name}-${payload.field}-status`;
export const getTableElement = (
  element: Element,
  decimals = 2,
  singleCellValues = true
): React.ReactNode => {
  switch (element.type) {
    case 'status':
      return <TableStatus key={getStatusKey(element)} status={element} />;
    case 'value':
      return (
        <TableValue
          key={getValueKey(element)}
          value={element}
          decimals={decimals}
          singleCellValues={singleCellValues}
        />
      );
  }
};
