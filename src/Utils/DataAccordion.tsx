import React from 'react';

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  Hidden,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';

import { Unit } from '../Types/Topic';
import { capitalize } from './Page';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
    },
    content: {
      display: 'block',
    },
    primary: {
      flexBasis: '35%',
      flexShrink: 0,
      [theme.breakpoints.down('sm')]: {
        flexGrow: 1,
      },
    },
    secondary: {
      color: theme.palette.text.secondary,
      minWidth: 250,
    },
    detail: {
      margin: theme.spacing(2, 0),
    },
  })
);

export interface DataAccordionProps extends Omit<AccordionProps, 'children'> {
  actions?: React.ReactNode;
  children: React.ReactNode;
  primaryTitle: string;
  secondaryTitle: string;
  secondaryLabel: string;
  AccordionSummaryProps?: AccordionSummaryProps & { 'data-testid': string };
}

export const DataAccordion = ({
  actions,
  children,
  primaryTitle,
  secondaryLabel,
  secondaryTitle,
  AccordionSummaryProps,
  ...props
}: DataAccordionProps) => {
  const classes = useStyles();

  return (
    <Accordion {...props}>
      <AccordionSummary
        className={classes.header}
        expandIcon={<ExpandMore />}
        {...AccordionSummaryProps}
      >
        <Typography className={classes.primary}>{primaryTitle}</Typography>
        <Hidden smDown>
          <Tooltip title={secondaryLabel} placement="left">
            <Typography className={classes.secondary}>
              {secondaryTitle}
            </Typography>
          </Tooltip>
        </Hidden>
      </AccordionSummary>
      <AccordionDetails className={classes.content}>
        <Hidden mdUp>
          <Detail title={secondaryLabel}>
            <div>{secondaryTitle}</div>
          </Detail>
        </Hidden>
        {children}
      </AccordionDetails>
      {actions && <AccordionActions>{actions}</AccordionActions>}
    </Accordion>
  );
};

export interface DetailProps {
  title: string;
  children: React.ReactNode;
}

export const Detail = ({ title, children }: DetailProps) => {
  const classes = useStyles();

  return (
    <div className={classes.detail}>
      <Typography color="textSecondary" display="block" variant="caption">
        {title}
      </Typography>
      {children}
    </div>
  );
};

interface DataDetailContentProps {
  value: unknown;
  unit?: string;
}

const DataDetailContent = ({
  value,
  unit,
}: DataDetailContentProps): React.ReactElement => {
  return (
    <>
      {String(value)} {unit && String(unit)}
    </>
  );
};

export interface DataDetailsProps {
  values: { [key: string]: unknown };
  units?: Unit[];
}

export const DataDetails = ({
  values,
  units,
}: DataDetailsProps): React.ReactElement => (
  <>
    {Object.keys(values).map((key) => (
      <Detail key={key} title={capitalize(key)}>
        <DataDetailContent
          value={values[key]}
          unit={units?.find(({ field }) => field === key)?.unit}
        />
      </Detail>
    ))}
  </>
);
