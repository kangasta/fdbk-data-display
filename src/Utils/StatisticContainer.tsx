import React from 'react';

import { Typography } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      marginBottom: theme.spacing(6),
    },
    title: {
      marginBottom: theme.spacing(3),
    },
  })
);

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ').toLowerCase();

export interface StatisticContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const StatisticContainer = ({
  title,
  className = '',
  children,
}: StatisticContainerProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={`${classes.container} ${className}`}>
      {title && (
        <Typography className={classes.title} variant="h5" component="h2">
          {capitalize(title)}
        </Typography>
      )}
      {children}
    </div>
  );
};
