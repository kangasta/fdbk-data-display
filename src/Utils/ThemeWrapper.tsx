import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  useMediaQuery,
} from '@material-ui/core';
import { deepPurple, deepOrange } from '@material-ui/core/colors';

import { StateType } from '../Reducers/main';
import MetaThemeColor from './MetaThemeColor';

const darkTheme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: deepOrange,
    type: 'dark',
  },
});

const lightTheme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: deepOrange,
  },
});

export interface ThemeWrapperProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  children: React.ReactNode;
}

export const ThemeWrapper = ({
  darkMode,
  setDarkMode,
  children,
}: ThemeWrapperProps): React.ReactElement => {
  const initialDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setDarkMode(initialDarkMode);
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <MetaThemeColor />
      {children}
    </ThemeProvider>
  );
};

const mapStateToProps = (state: StateType) => ({
  darkMode: state.settings.darkMode,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setDarkMode: (darkMode: boolean) =>
    dispatch({ type: 'SET_DARK_MODE', darkMode }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeWrapper);
