import React, { useEffect, useState } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';

import {
  Toolbar,
  makeStyles,
  Theme,
  createStyles,
  AppBar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  Hidden,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  InvertColors,
  Settings,
  GitHub,
  Home,
  ExpandMore,
} from '@material-ui/icons';

import { StateType } from '../Reducers/main';
import { setDarkMode } from '../Utils/actionCreators';
import AccountContainer from './AccountContainer';
import { PageContainer } from '../Utils/Page';
import { getDownQuery } from '../Utils/ThemeWrapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor:
        theme.palette.type == 'dark'
          ? theme.palette.grey['800']
          : theme.palette.primary.main,
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
    darkMode: {
      transform: 'scaleX(-1)',
    },
    invertColorsIcon: {
      transition: 'transform 250ms ease-in-out',
    },
    title: {
      flexGrow: 1,
    },
  })
);

export interface TopBarProps {
  darkMode: boolean;
  hasAuthentication: boolean;
  title: string;
  setDarkMode: (darkMode: boolean) => void;
}

export const TopBar = ({
  darkMode,
  hasAuthentication,
  title,
  setDarkMode,
}: TopBarProps) => {
  const classes = useStyles();
  const history = useHistory();
  const isSettingsActive = useRouteMatch('/settings');
  const downXs = useMediaQuery(getDownQuery('xs'));

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.document.title = title;
  }, [title]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const invertColorsClasses = `${darkMode ? classes.darkMode : ''} ${
    classes.invertColorsIcon
  }`;

  const settingsLinkTarget = isSettingsActive ? '/' : '/settings';
  const settingsLinkView = isSettingsActive ? 'home' : 'settings';
  const settingsLinkIcon = isSettingsActive ? <Home /> : <Settings />;

  const menuItems = [
    {
      text: 'Open GitHub repository',
      onClick: () => {
        window.open('https://github.com/kangasta/fdbk-data-display', '_blank');
      },
      icon: <GitHub />,
      testid: 'github-open-button',
    },
    {
      text: `Open ${settingsLinkView}`,
      onClick: () => history.push(settingsLinkTarget),
      icon: settingsLinkIcon,
      testid: 'settings-view-toggle-button',
    },
    {
      text: 'Toggle dark mode',
      onClick: toggleDarkMode,
      icon: <InvertColors />,
      testid: 'darkmode-toggle-button',
      className: invertColorsClasses,
      edge: (hasAuthentication ? false : 'end') as false | 'end',
    },
  ];

  return (
    <AppBar className={classes.appBar} position="static">
      <PageContainer>
        <Toolbar disableGutters={downXs}>
          <Typography
            className={classes.title}
            component="h1"
            variant="h6"
            noWrap
          >
            {title}
          </Typography>
          <Hidden xsDown>
            {menuItems.map(({ text, onClick, icon, testid, ...props }) => (
              <Tooltip key={testid} title={text}>
                <IconButton
                  color="inherit"
                  onClick={onClick}
                  data-testid={testid}
                  {...props}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}
          </Hidden>
          <Hidden smUp>
            <IconButton
              onClick={() => setMenuOpen(true)}
              color="inherit"
              edge={hasAuthentication ? false : 'end'}
              data-testid="menu-toggle-button"
            >
              <ExpandMore />
            </IconButton>
          </Hidden>
          <AccountContainer />
          <Drawer
            anchor="top"
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          >
            {menuItems.map(({ text, onClick, icon, testid }) => (
              <ListItem
                button
                onClick={() => {
                  onClick();
                  setMenuOpen(false);
                }}
                key={testid}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            {/* <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List> */}
          </Drawer>
        </Toolbar>
      </PageContainer>
    </AppBar>
  );
};

const mapStateToProps = (state: StateType) => ({
  darkMode: state.settings.darkMode,
  hasAuthentication: Boolean(state.settings.authUrl && state.settings.clientId),
  title: state.settings.title,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setDarkMode }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
