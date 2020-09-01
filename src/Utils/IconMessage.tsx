import React from 'react';

import { Backdrop } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { CloudOff, ErrorOutline, SvgIconComponent } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      textAlign: 'center',
    },
    icon: {
      fontSize: 40,
      color: 'inherit',
      marginTop: theme.spacing(6),
    },
    message: {
      fontSize: 24,
      color: 'inherit',
      marginTop: theme.spacing(1),
    },
    error: {
      color: theme.palette.error.dark,
    },
    noData: {
      color: theme.palette.text.secondary,
    },
  })
);

export interface IconMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  Icon: SvgIconComponent;
  children: string;
}

export const IconMessage = ({
  Icon,
  children,
  className = '',
  ...props
}: IconMessageProps) => {
  const classes = useStyles();

  return (
    <div className={`${classes.center} ${className}`} {...props}>
      <div className={classes.icon}>
        <Icon color="inherit" fontSize="inherit" />
      </div>
      <p className={classes.message}>{children}</p>
    </div>
  );
};

export const NoData = (): React.ReactElement => {
  const classes = useStyles();

  return (
    <IconMessage className={classes.noData} Icon={CloudOff}>
      No data available
    </IconMessage>
  );
};

export interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  Icon?: SvgIconComponent;
  children: string;
}

export const Error = ({ Icon = ErrorOutline, ...props }: ErrorProps) => {
  const classes = useStyles();

  return (
    <Backdrop open invisible>
      <IconMessage
        className={classes.error}
        Icon={Icon}
        {...props}
        data-testid="error-container"
      />
    </Backdrop>
  );
};
