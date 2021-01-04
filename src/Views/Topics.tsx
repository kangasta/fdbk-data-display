import React, { useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { IconButton, Tooltip } from '@material-ui/core';
import { FormatListNumbered, PieChart } from '@material-ui/icons';

import { StateType } from '../Reducers/main';
import { NoData } from '../Utils/IconMessage';
import { Page, Title, capitalize, LastUpdated } from '../Utils/Page';
import { ViewWrapper } from '../Utils/View';
import { TopicsState } from '../Reducers/topics';
import { Topic } from '../Types/Topic';
import { DataAccordion, Detail } from '../Utils/DataAccordion';
import { Warning } from '../Utils/Warnings';
import { useTitle } from '../Utils/useTitle';
import { triggerUpdateTopics } from '../Utils/actionCreators';

export interface TopicDetailsProps {
  topic?: Topic | Omit<Topic, 'name' | 'id'>;
  id?: string;
  name?: string;
  error?: string;
}

export const TopicDetails = ({
  topic,
  id,
  name,
  error,
}: TopicDetailsProps): React.ReactElement => {
  const detailFields: (keyof Omit<Topic, 'name' | 'id'>)[] = [
    'description',
    'type',
    'template',
  ];

  return (
    <>
      {name && <Title>{name}</Title>}
      {error && <Warning severity="error">{error}</Warning>}
      {id && (
        <Detail title="ID">
          <div>{id}</div>
        </Detail>
      )}
      {topic &&
        detailFields.map(
          (key) =>
            topic[key] && (
              <Detail key={key} title={capitalize(key)}>
                <div>{topic[key]}</div>
              </Detail>
            )
        )}
    </>
  );
};

export interface TopicsProps {
  data: TopicsState['data'];
  status: TopicsState['status'];
  triggerUpdateTopics: typeof triggerUpdateTopics;
}

export const Topics = ({
  data,
  status,
  triggerUpdateTopics,
}: TopicsProps): React.ReactElement => {
  const history = useHistory();
  const { id: expanded } = useParams<{ id?: string }>();

  const expandedName = data.find(({ id }) => expanded === id)?.name;
  useTitle(expandedName ? `topic ${capitalize(expandedName)}` : 'topics');

  // Update topics data
  useEffect(() => {
    triggerUpdateTopics();
  }, [triggerUpdateTopics]);

  const getOnChange = (id: string) => () =>
    expanded === id
      ? history.replace('/topics')
      : history.replace(`/topics/${id}`);
  const getOnClick = (target: string) => () => {
    history.push(target);
  };

  const breadcrumbs = [
    { target: '/', label: 'Home' },
    { target: '/topics', label: 'Topics' },
    ...(expandedName
      ? [{ target: `/topics/${expanded}`, label: capitalize(expandedName) }]
      : []),
  ];

  return (
    <ViewWrapper
      status={status}
      hasData={Boolean(data.length)}
      breadcrumbs={breadcrumbs}
      updateTrigger={triggerUpdateTopics}
    >
      <Page>
        <Title>Topics list</Title>
        {data.length ? null : <NoData />}
        {data?.map(({ name, id, ...other }) => (
          <DataAccordion
            key={id}
            expanded={expanded === id}
            onChange={getOnChange(id)}
            primaryTitle={capitalize(name)}
            secondaryLabel="ID"
            secondaryTitle={id}
            AccordionSummaryProps={{
              'data-testid': `topics-accordion-summary-${id}`,
            }}
            actions={
              <>
                <Tooltip title="Show summary">
                  <IconButton
                    color="primary"
                    onClick={getOnClick(`/topics/${id}/summary`)}
                  >
                    <PieChart />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Show data">
                  <IconButton
                    color="primary"
                    onClick={getOnClick(`/topics/${id}/data`)}
                  >
                    <FormatListNumbered />
                  </IconButton>
                </Tooltip>
              </>
            }
          >
            <TopicDetails topic={other} />
          </DataAccordion>
        ))}
        <LastUpdated on={status.lastUpdated} />
      </Page>
    </ViewWrapper>
  );
};

const mapStateToProps = ({ topics }: StateType) => ({
  data: topics.data,
  status: topics.status,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ triggerUpdateTopics }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Topics);
