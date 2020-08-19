import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(0.5),
      textAlign: 'center',
    },
  })
);

export interface ViewProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Footer = (): React.ReactElement | null => {
  const classes = useStyles();
  const version = process.env.VERSION;

  if (!version) return null;
  return <p className={classes.footer}>Version: {version}</p>;
};
