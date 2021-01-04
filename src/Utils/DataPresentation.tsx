import React, { useEffect, useState } from 'react';

import { DateTime } from 'luxon';

import { Tooltip } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    console: {
      background: theme.palette.action.hover,
      borderRadius: theme.shape.borderRadius,
      fontFamily: '"Roboto Mono", monospace',
      padding: theme.spacing(1, 1),
      whiteSpace: 'pre-wrap',
    },
    consoleTimestamp: {
      color: theme.palette.text.secondary,
      fontWeight: 400,
      marginRight: theme.spacing(0.5),
    },
    stdin: {
      color: theme.palette.success.main,
    },
    stdout: {},
    stderr: {
      color: theme.palette.error.main,
      fontWeight: 600,
    },
    timestamp: {
      textDecoration: 'underline',
      textDecorationStyle: 'dotted',
    },
  })
);

interface ConsoleRowType {
  stream: 'stdin' | 'stderr' | 'stdout';
  text: string;
  timestamp: string;
}

interface DataContentProps {
  value: unknown;
}

const Console = ({ value }: DataContentProps): React.ReactElement => {
  const classes = useStyles();

  if (Array.isArray(value)) {
    return (
      <div className={classes.console}>
        {value.map(({ stream, text, timestamp }: ConsoleRowType) => (
          <div key={`${timestamp}-${text}`} className={classes[stream]}>
            <span className={classes.consoleTimestamp}>
              {DateTime.fromISO(timestamp).toFormat('HH:mm:ss.u')}{' '}
            </span>
            {stream === 'stdin' && '+ '}
            {String(text)}
          </div>
        ))}
      </div>
    );
  }

  return <div className={classes.console}>{String(value)}</div>;
};

const asRelative = (timestamp: unknown) =>
  DateTime.fromISO(String(timestamp)).setLocale('en').toRelative();

export const Timestamp = ({ value }: DataContentProps): React.ReactElement => {
  const classes = useStyles();
  const [relative, setRelative] = useState<string | null>(asRelative(value));

  useEffect(() => {
    const interval = setInterval(() => setRelative(asRelative(value)), 1000);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  return (
    <Tooltip title={String(value)} placement="right">
      <span className={classes.timestamp}>{relative}</span>
    </Tooltip>
  );
};

export interface DataDetailContentProps {
  value: unknown;
  unit?: string;
}

export const DataDetailContent = ({
  value,
  unit,
}: DataDetailContentProps): React.ReactElement => {
  switch (unit) {
    case 'console':
      return <Console value={value} />;
    case 'timestamp':
    case 'iso_8601':
      return <Timestamp value={value} />;
    default:
      return (
        <>
          {String(value)} {unit && String(unit)}
        </>
      );
  }
};
