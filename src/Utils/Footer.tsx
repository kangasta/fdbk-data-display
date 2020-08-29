import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(0.5),
      minHeight: theme.spacing(3),
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
  const tag = process.env.TAG;
  const commit = process.env.COMMIT?.slice(0, 8);

  if (!commit && !tag) return null;
  return (
    <p className={classes.footer}>
      Version: {tag} {commit}
    </p>
  );
};
