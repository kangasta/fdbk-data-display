import React from 'react';
import {
  Paper,
  PaperProps,
  useMediaQuery,
  ContainerProps,
  Container,
} from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { getDownQuery } from './ThemeWrapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    page: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
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
  const downXs = useMediaQuery(getDownQuery('xs'));
  const classes = useStyles();

  return (
    <Paper className={classes.page} square={downXs} {...props}>
      {children}
    </Paper>
  );
};

export const PageContainer = ({
  children,
  ...props
}: PageProps & ContainerProps): React.ReactElement => {
  const downXs = useMediaQuery(getDownQuery('xs'));

  return (
    <Container disableGutters={downXs} maxWidth="lg" {...props}>
      {children}
    </Container>
  );
};
