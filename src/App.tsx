import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Container } from '@material-ui/core';

import TopBar from './Components/TopBar';
import mainReducer from './Reducers/main';
import ThemeWrapper from './Utils/ThemeWrapper';
import Login from './Views/Login';
import { Settings } from './Views/Settings';
import Statistics from './Views/Statistics';

const store = createStore(mainReducer);

export const App = () => {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        <Router>
          <TopBar />
          <Container maxWidth="lg">
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/">
                <Statistics />
              </Route>
            </Switch>
          </Container>
        </Router>
      </ThemeWrapper>
    </Provider>
  );
};

export default App;
