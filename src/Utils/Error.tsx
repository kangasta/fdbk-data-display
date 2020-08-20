import React from 'react';
import { Typography } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

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
    <Page data-testid="error-container">
      <Typography className={classes.errorTitle} variant="h5" component="h2">
        {title}
      </Typography>
      <p>{children}</p>
    </Page>
  );
};
