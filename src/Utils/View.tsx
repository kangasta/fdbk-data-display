import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    view: {
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
    },
    main: {
      flex: 1,
    },
    footer: {},
  })
);

export interface ViewProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const View = ({ children, footer }: ViewProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.view}>
      <div className={classes.main}>{children}</div>
      <div className={classes.footer}>{footer}</div>
    </div>
  );
};
