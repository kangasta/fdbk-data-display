import React from 'react';
import {
  Paper,
  makeStyles,
  Theme,
  createStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
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
    <Paper className={classes.error}>
      <Typography className={classes.errorTitle} variant="h5" component="h2">
        {title}
      </Typography>
      <p>{children}</p>
    </Paper>
  );
};
