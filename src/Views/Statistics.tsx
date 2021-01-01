import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ChartContainer, getChartKey } from '../Components/ChartContainer';
import TableContainer, { getTableKey } from '../Components/TableContainer';
import ListContainer, { getListKey } from '../Components/ListContainer';

import { StateType } from '../Reducers/main';
import { NoData } from '../Utils/IconMessage';
import { capitalize, Page } from '../Utils/Page';
import QueryBar from '../Components/QueryBar';
import { QueryState } from '../Reducers/query';
import { withQueryString } from '../Utils/queryUtils';
import { Warnings } from '../Utils/Warnings';
import { List, Table } from '../Types/Statistics';
import { useApi } from '../Utils/useApi';
import { ViewWrapper } from '../Utils/View';
import { TopicsState } from '../Reducers/topics';
import { TopicDetails } from './Topics';
import { StatisticContainer } from '../Utils/StatisticContainer';

export type StatisticsType = any[];

const chart = (i: any): React.ReactElement => (
  <ChartContainer key={getChartKey(i.payload)} {...i.payload} />
);
const list = (i: List): React.ReactElement => (
  <ListContainer key={getListKey(i.payload)} {...i.payload} />
);
const table = (i: Table): React.ReactElement => (
  <TableContainer key={getTableKey(i.payload)} {...i.payload} />
);
type statisticsType = 'chart' | 'list' | 'table';
const statisticMap = { chart, list, table };

const checkDataHasStatistics = (data: any): string | null =>
  data.statistics ? null : 'No statistics data in the response from server.';
const statisticsChecks = [checkDataHasStatistics];

export interface StatisticsProps {
  aggregateTo?: number;
  limit?: number;
  query: QueryState;
  showQueryBar: boolean;
  topicsData: TopicsState['data'];
  topicsStatus: TopicsState['status'];
}

export const Statistics = ({
  aggregateTo,
  limit,
  query,
  showQueryBar,
  topicsData,
  topicsStatus,
}: StatisticsProps): React.ReactElement => {
  const { id: topicId } = useParams<{ id?: string }>();

  // Path might contain timestamps, which will change on every re-render
  const path = useMemo(() => {
    const basePath = topicId ? `/topics/${topicId}/summary` : '/overview';
    return showQueryBar
      ? withQueryString(basePath, query, {
          aggregate_to: aggregateTo,
          limit,
        })
      : basePath;
  }, [topicId, showQueryBar, query, aggregateTo, limit]);

  const [data, status] = useApi(path, statisticsChecks);
  const statistics: StatisticsType = data?.statistics ?? [];
  const warnings: string[] = data?.warnings ?? [];

  const statisticContainers = statistics
    .filter((i) => Object.keys(statisticMap).includes(i.type))
    .map((i) => statisticMap[i.type as statisticsType](i));

  const topic = topicsData.find(({ id }) => topicId === id);
  const topicName = topic ? capitalize(topic.name) : topicId;
  const breadcrumbs = [
    { target: '/', label: 'Home', disable: !topicId },
    ...(topicName
      ? [
          { target: '/topics', label: 'Topics' },
          { target: `/topics/${topicId}`, label: topicName },
          { label: 'Summary' },
        ]
      : [{ target: '/', label: 'Overview' }]),
  ];

  return (
    <ViewWrapper
      status={status}
      hasData={Boolean(statistics.length)}
      breadcrumbs={breadcrumbs}
    >
      {showQueryBar && <QueryBar />}
      <Page>
        <Warnings warnings={warnings} />
        {topicId && (
          <StatisticContainer>
            <TopicDetails
              name={topicName}
              topic={topic}
              id={topicId}
              error={topicsStatus.error}
            />
          </StatisticContainer>
        )}
        {statistics.length ? null : <NoData />}
        {statisticContainers}
      </Page>
    </ViewWrapper>
  );
};

const mapStateToProps = ({ query, settings, topics }: StateType) => ({
  aggregateTo: settings.aggregateTo,
  limit: settings.limit,
  showQueryBar: settings.showQueryBar,
  query,
  topicsData: topics.data,
  topicsStatus: topics.status,
});

export default connect(mapStateToProps)(Statistics);
