import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { IconButton, Tooltip } from '@material-ui/core';
import { FormatListNumbered } from '@material-ui/icons';

import { StateType } from '../Reducers/main';
import { NoData } from '../Utils/IconMessage';
import { Page, Title, capitalize } from '../Utils/Page';
import { ViewWrapper } from '../Utils/View';
import { TopicsState } from '../Reducers/topics';
import { Topic } from '../Types/Topic';
import { DataAccordion, Detail } from '../Utils/DataAccordion';

export interface TopicDetailsProps {
  topic: Topic | Omit<Topic, 'name' | 'id'>;
  id?: string;
}

export const TopicDetails = ({
  topic,
  id,
}: TopicDetailsProps): React.ReactElement => {
  const detailFields: (keyof Omit<Topic, 'name' | 'id'>)[] = [
    'description',
    'type',
    'template',
  ];

  return (
    <>
      {id && (
        <Detail title="ID">
          <div>{id}</div>
        </Detail>
      )}
      {detailFields.map(
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
}

export const Topics = ({ data, status }: TopicsProps): React.ReactElement => {
  const history = useHistory();
  const { id: expanded } = useParams<{ id?: string }>();

  const getOnChange = (id: string) => () =>
    expanded === id
      ? history.replace('/topics')
      : history.replace(`/topics/${id}`);
  const getOnClick = (target: string) => () => {
    history.push(target);
  };

  const expandedName = data.find(({ id }) => expanded === id)?.name;

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
      </Page>
    </ViewWrapper>
  );
};

const mapStateToProps = ({ topics }: StateType) => ({
  data: topics.data,
  status: topics.status,
});

export default connect(mapStateToProps)(Topics);
