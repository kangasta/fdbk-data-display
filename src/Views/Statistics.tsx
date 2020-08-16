import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import ChartContainer, { getChartKey } from '../Components/ChartContainer';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { StateType } from '../Reducers/main';
import { Error } from '../Utils/Error';
import { Page } from '../Utils/Page';

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
}

export const Statistics = ({
  apiUrl,
  idToken,
  tokenType,
}: StatisticsProps): React.ReactElement => {
  const [statistics, setStatistics] = useState<StatisticsType>([]);
  const [status, setStatus] = useState<StatusType>(LOADING_STATUS);

  useEffect(() => {
    const fetchData = async () => {
      if (!apiUrl) {
        setStatus({ error: 'API not configured. Can not load data.' });
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
      }
    };
    fetchData();
  }, [apiUrl, tokenType, idToken]);

  if (status?.loading) {
    return (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    );
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

export default connect(mapStateToProps)(Statistics);
