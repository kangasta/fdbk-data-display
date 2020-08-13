import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  Toolbar,
  makeStyles,
  Theme,
  createStyles,
  AppBar,
  Typography,
  IconButton,
  Container,
} from '@material-ui/core';
import { BrightnessHigh, BrightnessLow } from '@material-ui/icons';

import { StateType } from '../Reducers/main';
import AccountContainer from './AccountContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    appBar: {
      backgroundColor:
        theme.palette.type == 'dark'
          ? theme.palette.grey['800']
          : theme.palette.primary.main,
    },
  })
);

export interface TopBarProps {
  darkMode: boolean;
  hasAuthentication: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export const TopBar = ({
  darkMode,
  hasAuthentication,
  setDarkMode,
}: TopBarProps) => {
  const classes = useStyles();
  const toggleDarkMode = () => setDarkMode(!darkMode);

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
            fdbk-data-display
          </Typography>
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            edge={hasAuthentication ? false : 'end'}
            data-testid="darkmode-toggle-button"
          >
            {darkMode ? <BrightnessHigh /> : <BrightnessLow />}
          </IconButton>
          <AccountContainer />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const mapStateToProps = (state: StateType) => ({
  darkMode: state.settings.darkMode,
  hasAuthentication: Boolean(state.settings.authUrl && state.settings.clientId),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setDarkMode: (darkMode: boolean) =>
    dispatch({ type: 'UPDATE_SETTINGS', settings: { darkMode } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
