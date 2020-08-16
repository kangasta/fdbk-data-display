import React, { useEffect } from 'react';
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
  Container,
  Tooltip,
} from '@material-ui/core';
import { InvertColors, Settings, GitHub, Home } from '@material-ui/icons';

import { StateType } from '../Reducers/main';
import { setDarkMode } from '../Utils/actionCreators';
import AccountContainer from './AccountContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor:
        theme.palette.type == 'dark'
          ? theme.palette.grey['800']
          : theme.palette.primary.main,
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

  return (
    <AppBar className={classes.appBar} position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            className={classes.title}
            component="h1"
            variant="h6"
            noWrap
          >
            {title}
          </Typography>
          <Tooltip title="Open GitHub repository">
            <IconButton
              color="inherit"
              component="a"
              href="https://github.com/kangasta/fdbk-data-display"
              target="_blank"
            >
              <GitHub />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Open ${settingsLinkView}`}>
            <IconButton
              color="inherit"
              onClick={() => history.push(settingsLinkTarget)}
              data-testid="settings-view-toggle-button"
            >
              {settingsLinkIcon}
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle dark mode">
            <IconButton
              className={invertColorsClasses}
              onClick={toggleDarkMode}
              color="inherit"
              edge={hasAuthentication ? false : 'end'}
              data-testid="darkmode-toggle-button"
            >
              <InvertColors />
            </IconButton>
          </Tooltip>
          <AccountContainer />
        </Toolbar>
      </Container>
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
