import React, { useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { CssBaseline, useMediaQuery } from '@material-ui/core';

import { ThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import { deepPurple, deepOrange } from '@material-ui/core/colors';

import { StateType } from '../Reducers/main';
import { setDarkMode } from '../Utils/actionCreators';
import MetaThemeColor from './MetaThemeColor';

type widthParam = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export const getDownQuery = (width: widthParam) => (theme: Theme) =>
  theme.breakpoints.down(width);

const darkTheme = createMuiTheme({
  palette: {
    primary: { main: deepPurple[300] },
    secondary: { main: deepOrange[300] },
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
  }, [initialDarkMode, setDarkMode]);

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
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setDarkMode }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ThemeWrapper);
