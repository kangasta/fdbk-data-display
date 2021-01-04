import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { DateTime } from 'luxon';

import { StateType } from '../Reducers/main';
import { NoData } from '../Utils/IconMessage';
import { Page, capitalize, LastUpdated } from '../Utils/Page';
import { ViewWrapper, BreadcrumbLink } from '../Utils/View';
import { TopicsState } from '../Reducers/topics';
import { DataAccordion, DataDetails } from '../Utils/DataAccordion';
import { useApi } from '../Utils/useApi';
import { TopicDetails } from './Topics';
import { StatisticContainer } from '../Utils/StatisticContainer';
import { useTitle } from '../Utils/useTitle';

export interface DataType {
  topic_id: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface DataProps {
  topicsData: TopicsState['data'];
  topicsStatus: TopicsState['status'];
}

export const Data = ({
  topicsData,
  topicsStatus,
}: DataProps): React.ReactElement => {
  const { id: topicId } = useParams<{ id: string }>();

  const path = useMemo(() => `/topics/${topicId}/data?limit=100`, [topicId]);
  const [data, status, updateTrigger] = useApi<DataType[]>(path);

  const topic = topicsData.find(({ id }) => topicId === id);
  const topicName = topic ? capitalize(topic.name) : topicId;
  useTitle(`data for ${topicName}`);

  const breadcrumbs: BreadcrumbLink[] = [
    { target: '/', label: 'Home' },
    { target: '/topics', label: 'Topics' },
    { target: `/topics/${topicId}`, label: topicName },
    { label: 'Data' },
  ];

  const newestFirst = (data ? [...data] : []).reverse();

  return (
    <ViewWrapper
      status={status}
      hasData={Boolean(data?.length)}
      breadcrumbs={breadcrumbs}
      updateTrigger={updateTrigger}
    >
      <Page>
        <StatisticContainer>
          <TopicDetails
            name={topicName}
            topic={topic}
            id={topicId}
            error={topicsStatus.error}
          />
        </StatisticContainer>
        <StatisticContainer title="Data">
          {newestFirst.length ? null : <NoData />}
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {newestFirst.map(({ timestamp, topic_id, ...values }) => (
            <DataAccordion
              key={timestamp}
              primaryTitle={
                DateTime.fromISO(timestamp).setLocale('en').toRelative() ??
                timestamp
              }
              secondaryTitle={timestamp}
              secondaryLabel="Timestamp"
              AccordionSummaryProps={{
                'data-testid': `data-accordion-summary-${timestamp}`,
              }}
            >
              <DataDetails values={values} units={topic?.units} />
            </DataAccordion>
          ))}
        </StatisticContainer>
        <LastUpdated on={status.lastUpdated} />
      </Page>
    </ViewWrapper>
  );
};

const mapStateToProps = ({ topics }: StateType) => ({
  topicsData: topics.data,
  topicsStatus: topics.status,
});

export default connect(mapStateToProps)(Data);
