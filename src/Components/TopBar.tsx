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
  setDarkMode: (darkMode: boolean) => void;
}

export const TopBar = ({ darkMode, setDarkMode }: TopBarProps) => {
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
          <IconButton onClick={toggleDarkMode} color="inherit" edge="end">
            {darkMode ? <BrightnessHigh /> : <BrightnessLow />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const mapStateToProps = (state: StateType) => ({
  darkMode: state.settings.darkMode,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setDarkMode: (darkMode: boolean) =>
    dispatch({ type: 'SET_DARK_MODE', darkMode }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
