import React from 'react';
import { makeStyles, Theme, createStyles, Typography } from '@material-ui/core';

import { Page } from './Page';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorTitle: {
      color: theme.palette.error.dark,
    },
  })
);

export interface ErrorProps {
  title?: string;
  children?: string;
}

export const Error = ({
  title = 'Error',
  children,
}: ErrorProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <Page>
      <Typography className={classes.errorTitle} variant="h5" component="h2">
        {title}
      </Typography>
      <p>{children}</p>
    </Page>
  );
};
