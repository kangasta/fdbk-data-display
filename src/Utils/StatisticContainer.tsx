import React from 'react';

import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import { Title } from './Page';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      marginBottom: theme.spacing(6),
    },
  })
);

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
      {title && <Title capitalizeTitle>{title}</Title>}
      {children}
    </div>
  );
};
