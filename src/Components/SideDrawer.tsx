import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { PieChart, List as ListIcon, Close } from '@material-ui/icons';

import { StateType } from '../Reducers/main';
import { setShowSideDrawer } from '../Utils/actionCreators';
import { TopicsState } from '../Reducers/topics';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      minWidth: 250,
    },
    header: {
      ...theme.mixins.toolbar,
      alignItems: 'center',
      display: 'flex',
      padding: theme.spacing(0, 2),
    },
    title: {
      flexGrow: 1,
    },
    dividerTitle: {
      margin: theme.spacing(0.5, 0, 0, 2),
    },
    topicsLoading: {
      color: theme.palette.text.secondary,
      margin: theme.spacing(2, 0),
      textAlign: 'center',
    },
  })
);

interface TitledDividerProps {
  title?: string;
}

const TitledDivider = ({ title }: TitledDividerProps) => {
  const classes = useStyles();

  return (
    <>
      <Divider />
      {title && (
        <li>
          <Typography
            className={classes.dividerTitle}
            color="textSecondary"
            display="block"
            variant="caption"
          >
            {title}
          </Typography>
        </li>
      )}
    </>
  );
};

export interface SideDrawerProps {
  showSideDrawer: boolean;
  title: string;
  topics: TopicsState;
  setShowSideDrawer: (showSideDrawer: boolean) => void;
}

export const SideDrawer = ({
  showSideDrawer,
  title,
  topics,
  setShowSideDrawer,
}: SideDrawerProps) => {
  const classes = useStyles();
  const history = useHistory();

  const onClose = () => setShowSideDrawer(false);
  const getOnClick = (target: string) => () => {
    history.push(target);
    onClose();
  };

  const links = [
    { name: 'Overview', Icon: PieChart, target: '/' },
    { name: 'Topics', Icon: ListIcon, target: '/topics' },
  ];

  return (
    <>
      <Drawer anchor="left" open={showSideDrawer} onClose={onClose}>
        <div className={classes.header}>
          <Typography className={classes.title} variant="h6" noWrap>
            {title}
          </Typography>
          <IconButton color="inherit" edge="end" onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.list}>
          {links.map(({ name, Icon, target }) => (
            <ListItem button onClick={getOnClick(target)} key={name}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
          <TitledDivider title="Topics" />
          {topics.status.loading && !topics.data?.length && (
            <li className={classes.topicsLoading}>
              <CircularProgress color="inherit" size={24} />
            </li>
          )}
          {topics.data
            ?.filter(({ type }) => type === 'topic')
            .map(({ name, id }) => (
              <ListItem button onClick={getOnClick(`/topics/${id}`)} key={id}>
                <ListItemText primary={name} />
              </ListItem>
            ))}
        </List>
      </Drawer>
    </>
  );
};

const mapStateToProps = ({ settings, topics, ui }: StateType) => ({
  showSideDrawer: ui.showSideDrawer,
  title: settings.title,
  topics: topics,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setShowSideDrawer }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
