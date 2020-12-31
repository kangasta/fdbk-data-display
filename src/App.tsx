import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import TopBar from './Components/TopBar';
import mainReducer from './Reducers/main';
import ThemeWrapper from './Utils/ThemeWrapper';
import Login from './Views/Login';
import Settings from './Views/Settings';
import Statistics from './Views/Statistics';
import { Footer } from './Utils/Footer';
import { PageContainer } from './Utils/Page';
import SideDrawer from './Components/SideDrawer';
import { View } from './Utils/View';
import { mainSaga } from './Sagas/main';
import Topics from './Views/Topics';
import Data from './Views/Data';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(mainReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(mainSaga);

export const App = (): React.ReactElement => {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        <Router basename={process.env.PUBLIC_URL}>
          <View footer={<Footer />}>
            <TopBar />
            <SideDrawer />
            <PageContainer padding>
              <Switch>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/settings">
                  <Settings />
                </Route>
                <Route path="/topics/:id/data">
                  <Data />
                </Route>
                <Route path="/topics/:id">
                  <Topics />
                </Route>
                <Route path="/topics">
                  <Topics />
                </Route>
                <Route path="/">
                  <Statistics />
                </Route>
              </Switch>
            </PageContainer>
          </View>
        </Router>
      </ThemeWrapper>
    </Provider>
  );
};

export default App;
