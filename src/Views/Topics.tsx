import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import { StateType } from '../Reducers/main';
import { NoData } from '../Utils/IconMessage';
import { Page, Title, capitalize } from '../Utils/Page';
import { ViewWrapper } from '../Utils/View';
import { TopicsState } from '../Reducers/topics';

import { Topic } from '../Types/Topic';
import { ExpandMore, FormatListNumbered } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
    },
    content: {
      display: 'block',
    },
    primary: {
      flexBasis: '35%',
      flexShrink: 0,
    },
    secondary: {
      color: theme.palette.text.secondary,
      minWidth: 250,
    },
    detail: {
      marginTop: theme.spacing(3),
    },
  })
);

export interface DetailProps {
  title: string;
  children: React.ReactNode;
}

export const Detail = ({ title, children }: DetailProps) => {
  const classes = useStyles();

  return (
    <div className={classes.detail}>
      <Typography color="textSecondary" display="block" variant="caption">
        {title}
      </Typography>
      {children}
    </div>
  );
};

export interface TopicsProps {
  data: TopicsState['data'];
  status: TopicsState['status'];
}

export const Topics = ({ data, status }: TopicsProps): React.ReactElement => {
  const classes = useStyles();
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

  const detailFields: (keyof Omit<Topic, 'name' | 'id'>)[] = [
    'description',
    'type',
    'template',
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
          <Accordion
            key={id}
            expanded={expanded === id}
            onChange={getOnChange(id)}
          >
            <AccordionSummary
              className={classes.header}
              expandIcon={<ExpandMore />}
              data-testid={`topics-accordion-summary-${id}`}
            >
              <Typography className={classes.primary}>
                {capitalize(name)}
              </Typography>
              <Typography className={classes.secondary}>{id}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.content}>
              {detailFields.map(
                (key) =>
                  other[key] && (
                    <Detail key={key} title={capitalize(key)}>
                      <div>{other[key]}</div>
                    </Detail>
                  )
              )}
            </AccordionDetails>
            <AccordionActions>
              <Tooltip title="Show data">
                <IconButton
                  color="primary"
                  onClick={getOnClick(`/topics/${id}/data`)}
                >
                  <FormatListNumbered />
                </IconButton>
              </Tooltip>
            </AccordionActions>
          </Accordion>
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
