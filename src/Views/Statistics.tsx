import React, { useState, useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import ChartContainer, { getChartKey } from '../Components/ChartContainer';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import { StateType } from '../Reducers/main';
import { Error, NoData } from '../Utils/IconMessage';
import { Page } from '../Utils/Page';
import { clearAuthentication } from '../Utils/actionCreators';
import { GettingStarted } from './GettingStarted';
import QueryBar from '../Components/QueryBar';
import { QueryState } from '../Reducers/query';
import { withQueryString } from '../Utils/queryUtils';

const API_NOT_CONFIGURED = 'API not configured. Can not load data.';
const LOADING_STATUS = {
  loading: 'Loading statistics',
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      textAlign: 'center',
    },
    showLoading: {
      marginTop: theme.spacing(3),
      maxHeight: '100px',
      opacity: 1,
      // transform: 'scaleY(1)',
      transition: 'all 250ms',
    },
    hideLoading: {
      marginTop: 0,
      maxHeight: 0,
      opacity: 0,
      // transform: 'scaleY(0)',
      transition: 'all 250ms',
    },
    warning: {
      marginBottom: theme.spacing(1),
    },
  })
);

export type StatisticsType = any[];
export interface StatusType {
  error?: string;
  loading?: string;
}

export interface StatisticsProps {
  aggregateTo?: number;
  apiUrl?: string;
  idToken?: string;
  limit?: number;
  query: QueryState;
  showQueryBar: boolean;
  tokenType?: string;
  clearAuthentication: () => void;
}

export const Statistics = ({
  aggregateTo,
  apiUrl,
  idToken,
  limit,
  query,
  showQueryBar,
  tokenType,
  clearAuthentication,
}: StatisticsProps): React.ReactElement => {
  const classes = useStyles();
  const [statistics, setStatistics] = useState<StatisticsType>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusType>(LOADING_STATUS);

  useEffect(() => {
    const fetchData = async () => {
      if (!apiUrl) {
        setStatus({ error: API_NOT_CONFIGURED });
        return;
      }

      try {
        const headers =
          tokenType && idToken
            ? {
                Authorization: `${tokenType} ${idToken}`,
              }
            : undefined;

        setStatus(LOADING_STATUS);
        const url = showQueryBar
          ? withQueryString(apiUrl, query, { aggregate_to: aggregateTo, limit })
          : apiUrl;
        const response = await fetch(url, {
          headers,
          mode: 'cors',
        });
        const data = await response.json();

        if (!data.statistics) {
          setStatus({
            error: 'No statistics data in the response from server.',
          });
          return;
        }

        setStatistics(data.statistics);
        setWarnings(data.warnings);
        setStatus({});
      } catch (_) {
        setStatus({ error: 'Was not able to fetch data from the server.' });
        clearAuthentication();
      }
    };
    fetchData();
  }, [
    apiUrl,
    tokenType,
    idToken,
    query,
    clearAuthentication,
    aggregateTo,
    limit,
    showQueryBar,
  ]);

  if (status?.loading && !statistics.length) {
    return (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  if (status?.error === API_NOT_CONFIGURED) {
    return <GettingStarted />;
  }

  if (status?.error) {
    return <Error>{status.error}</Error>;
  }

  const charts = statistics
    .filter((i) => i.type === 'chart')
    .map((i) => <ChartContainer key={getChartKey(i.payload)} {...i.payload} />);

  const loadingClasses = `${classes.center} ${
    status?.loading ? classes.showLoading : classes.hideLoading
  }`;

  return (
    <>
      <div className={loadingClasses}>
        <CircularProgress color="primary" />
      </div>
      {showQueryBar && <QueryBar />}
      <Page>
        {warnings.map((warning) => (
          <Alert key={warning} className={classes.warning} severity="warning">
            {warning}
          </Alert>
        ))}
        {statistics.length ? null : <NoData />}
        {charts}
      </Page>
    </>
  );
};

const mapStateToProps = ({ authentication, query, settings }: StateType) => ({
  aggregateTo: settings.aggregateTo,
  apiUrl: settings.apiUrl,
  idToken: authentication?.id_token,
  limit: settings.limit,
  showQueryBar: settings.showQueryBar,
  query,
  tokenType: authentication?.token_type,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ clearAuthentication }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
