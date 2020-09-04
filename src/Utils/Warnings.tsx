import React from 'react';

import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from '@material-ui/core/styles';
import { Alert, AlertProps } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    warning: {
      marginBottom: theme.spacing(1),
    },
  })
);

export interface WarningsProps extends Partial<AlertProps> {
  warnings?: string[];
}

export const Warnings = ({
  warnings = [],
  ...props
}: WarningsProps): React.ReactElement | null => {
  const classes = useStyles();
  const theme = useTheme();

  const variant = theme.palette.type === 'dark' ? 'outlined' : 'standard';

  return (
    <>
      {warnings.map((warning) => (
        <Alert
          key={warning}
          className={classes.warning}
          severity="warning"
          variant={variant}
          {...props}
        >
          {warning}
        </Alert>
      ))}
    </>
  );
};
