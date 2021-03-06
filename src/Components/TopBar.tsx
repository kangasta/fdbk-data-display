import React, { useEffect, useState } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';

import {
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  Hidden,
  Backdrop,
} from '@material-ui/core';
import { InvertColors, Settings, GitHub, Home, Menu } from '@material-ui/icons';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import { StateType } from '../Reducers/main';
import { setDarkMode, setShowSideDrawer } from '../Utils/actionCreators';
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
    backDrop: {
      zIndex: theme.zIndex.speedDial - 1,
    },
    darkMode: {
      transform: 'scaleX(-1)',
    },
    invertColorsIcon: {
      transition: 'transform 250ms ease-in-out',
    },
    speedDial: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    speedDialTooltip: {
      whiteSpace: 'nowrap',
    },
    title: {
      flexGrow: 1,
    },
  })
);

export interface TopBarProps {
  darkMode: boolean;
  showMenuToggle: boolean;
  hasAuthentication: boolean;
  title: string;
  setShowSideDrawer: (showSideDrawer: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
}

export const TopBar = ({
  darkMode,
  showMenuToggle,
  hasAuthentication,
  title,
  setShowSideDrawer,
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
    <>
      <AppBar className={classes.appBar} position="static">
        <PageContainer>
          <Toolbar disableGutters={downXs}>
            {showMenuToggle && (
              <Tooltip title={'Open side drawer'}>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={() => setShowSideDrawer(true)}
                >
                  <Menu />
                </IconButton>
              </Tooltip>
            )}
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
            <AccountContainer />
          </Toolbar>
        </PageContainer>
      </AppBar>
      <Hidden smUp>
        <Backdrop className={classes.backDrop} open={menuOpen} />
        <SpeedDial
          ariaLabel="More menu"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={() => setMenuOpen(false)}
          onOpen={() => setMenuOpen(true)}
          open={menuOpen}
          FabProps={{ 'data-testid': 'menu-toggle-button' } as any}
        >
          {menuItems.map(({ text, onClick, icon, testid }) => (
            <SpeedDialAction
              key={testid}
              classes={{ staticTooltipLabel: classes.speedDialTooltip }}
              icon={icon}
              tooltipTitle={text}
              tooltipOpen
              onClick={() => {
                onClick();
                setMenuOpen(false);
              }}
              FabProps={{ 'data-testid': testid } as any}
            />
          ))}
        </SpeedDial>
      </Hidden>
    </>
  );
};

const mapStateToProps = (state: StateType) => ({
  darkMode: state.settings.darkMode,
  showMenuToggle: state.settings.fullApi,
  hasAuthentication: Boolean(state.settings.authUrl && state.settings.clientId),
  title: state.settings.title,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setDarkMode, setShowSideDrawer }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
