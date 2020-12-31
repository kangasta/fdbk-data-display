import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

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
    breadcrumbs: {
      marginBottom: theme.spacing(2),
      minHeight: 24,
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
    backgroundLoading: {
      float: 'right',
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
}

export const ViewWrapper = ({
  children,
  status,
  hasData,
  breadcrumbs,
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
      <PageContainer className={classes.breadcrumbs}>
        {status?.loading && hasData && (
          <div className={classes.backgroundLoading}>
            <CircularProgress color="primary" size={24} thickness={4.8} />
          </div>
        )}
        {breadcrumbs && (
          <Breadcrumbs>
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
        )}
      </PageContainer>
      {content}
    </>
  );
};
