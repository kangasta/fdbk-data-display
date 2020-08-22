import React, { useState, useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import ChartContainer, { getChartKey } from '../Components/ChartContainer';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { StateType } from '../Reducers/main';
import { Error } from '../Utils/Error';
import { Page } from '../Utils/Page';
import { clearAuthentication } from '../Utils/actionCreators';
import { GettingStarted } from './GettingStarted';

const API_NOT_CONFIGURED = 'API not configured. Can not load data.';
const LOADING_STATUS = {
  loading: 'Loading statistics',
};

export type StatisticsType = any[];
export interface StatusType {
  error?: string;
  loading?: string;
}

export interface StatisticsProps {
  apiUrl?: string;
  idToken?: string;
  tokenType?: string;
  clearAuthentication: () => void;
}

export const Statistics = ({
  apiUrl,
  idToken,
  tokenType,
  clearAuthentication,
}: StatisticsProps): React.ReactElement => {
  const [statistics, setStatistics] = useState<StatisticsType>([]);
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

        const response = await fetch(apiUrl, {
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
        setStatus({});
      } catch (_) {
        setStatus({ error: 'Was not able to fetch data from the server.' });
        clearAuthentication();
      }
    };
    fetchData();
  }, [apiUrl, tokenType, idToken, clearAuthentication]);

  if (status?.loading) {
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

  return <Page>{charts}</Page>;
};

const mapStateToProps = (state: StateType) => ({
  apiUrl: state.settings.apiUrl,
  idToken: state.authentication?.id_token,
  tokenType: state.authentication?.token_type,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ clearAuthentication }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
