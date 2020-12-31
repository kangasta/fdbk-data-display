import React from 'react';

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  Hidden,
  Typography,
} from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';

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
    },
    secondary: {
      color: theme.palette.text.secondary,
      minWidth: 250,
    },
    detail: {
      marginTop: theme.spacing(3),
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
          <Typography className={classes.secondary}>
            {secondaryTitle}
          </Typography>
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
