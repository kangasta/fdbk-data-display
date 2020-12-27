import React from 'react';
import {
  Paper,
  PaperProps,
  useMediaQuery,
  ContainerProps,
  Container,
  Typography,
} from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { getDownQuery } from './ThemeWrapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    page: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(3),
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
    pageContainer: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(6),
    },
    title: {
      marginBottom: theme.spacing(3),
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

export interface PageContainerProps {
  children?: React.ReactNode;
  padding?: boolean;
}

export const PageContainer = ({
  children,
  padding,
  ...props
}: PageContainerProps & ContainerProps): React.ReactElement => {
  const downXs = useMediaQuery(getDownQuery('xs'));
  const classes = useStyles();

  const pageContainerClass = padding ? classes.pageContainer : '';

  return (
    <Container
      className={pageContainerClass}
      disableGutters={downXs}
      maxWidth="lg"
      {...props}
    >
      {children}
    </Container>
  );
};

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ').toLowerCase();

export interface TitleProps {
  children: string;
  capitalizeTitle?: boolean;
}

export const Title = ({
  children,
  capitalizeTitle,
}: TitleProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <Typography className={classes.title} variant="h5" component="h2">
      {capitalizeTitle ? capitalize(children) : children}
    </Typography>
  );
};
