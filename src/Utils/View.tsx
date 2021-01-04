import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Backdrop,
  Breadcrumbs,
  CircularProgress,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Update } from '@material-ui/icons';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import { Error } from '../Utils/IconMessage';
import { API_NOT_CONFIGURED, StatusType } from './useApi';
import { GettingStarted } from '../Views/GettingStarted';
import { PageContainer } from './Page';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    view: {
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
    },
    main: {
      flex: 1,
    },
    footer: {},
    breadcrumbsHeader: {
      display: 'flex',
      marginBottom: theme.spacing(2),
      minHeight: 24,
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
    breadcrumbs: {
      flex: 1,
    },
    updateTrigger: {
      margin: theme.spacing(-1.5),
      padding: theme.spacing(1.5),
    },
  })
);

export interface ViewProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const View = ({ children, footer }: ViewProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.view}>
      <div className={classes.main}>{children}</div>
      <div className={classes.footer}>{footer}</div>
    </div>
  );
};

const isLast = (index: number, array: unknown[]): boolean =>
  index === array.length - 1;

export interface BreadcrumbLink {
  label: string;
  target?: string;
  disable?: boolean;
}

export interface ViewWrapperProps {
  children?: React.ReactNode;
  status?: StatusType;
  hasData?: boolean;
  breadcrumbs?: BreadcrumbLink[];
  updateTrigger?: () => void;
}

export const ViewWrapper = ({
  children,
  status,
  hasData,
  breadcrumbs,
  updateTrigger,
}: ViewWrapperProps): React.ReactElement => {
  const classes = useStyles();

  let content: React.ReactNode;
  if (status?.loading && !hasData) {
    content = (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  } else if (status?.error === API_NOT_CONFIGURED) {
    content = <GettingStarted />;
  } else if (status?.error) {
    content = <Error>{status.error}</Error>;
  } else {
    content = children;
  }

  return (
    <>
      <PageContainer className={classes.breadcrumbsHeader}>
        {breadcrumbs ? (
          <Breadcrumbs className={classes.breadcrumbs}>
            {breadcrumbs.map(({ label, target, disable }, i, arr) =>
              disable || isLast(i, arr) || target === undefined ? (
                <Typography key={label} color="textPrimary">
                  {label}
                </Typography>
              ) : (
                <Link
                  key={label}
                  color="inherit"
                  component={RouterLink}
                  to={target}
                >
                  {label}
                </Link>
              )
            )}
          </Breadcrumbs>
        ) : (
          <div className={classes.breadcrumbs} />
        )}
        {status?.loading && hasData && (
          <CircularProgress color="primary" size={24} thickness={4.8} />
        )}
        {!status?.loading && hasData && updateTrigger && (
          <Tooltip title="Update data">
            <IconButton
              className={classes.updateTrigger}
              onClick={updateTrigger}
            >
              <Update />
            </IconButton>
          </Tooltip>
        )}
      </PageContainer>
      {content}
    </>
  );
};
