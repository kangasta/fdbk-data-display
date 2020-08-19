import React from 'react';
import { Typography, makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      color: theme.palette.text.secondary,
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
  return (
    <div className={classes.footer}>
      <Typography variant="subtitle1">Version: {version}</Typography>
    </div>
  );
};
