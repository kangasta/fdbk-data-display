import React from 'react';
import {
  Paper,
  makeStyles,
  Theme,
  createStyles,
  PaperProps,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    page: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  })
);

export interface PageProps {
  children?: React.ReactNode;
}

export const Page: React.FC = ({
  children,
  ...props
}: PageProps & PaperProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <Paper className={classes.page} {...props}>
      {children}
    </Paper>
  );
};
