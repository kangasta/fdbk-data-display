import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { Container } from '@material-ui/core';

import TopBar from './Components/TopBar';
import mainReducer from './Reducers/main';
import ThemeWrapper from './Utils/ThemeWrapper';
import { Statistics } from './Views/Statistics';

const store = createStore(mainReducer);

export const App = () => {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        <TopBar />
        <Container maxWidth="lg">
          <Statistics />
        </Container>
      </ThemeWrapper>
    </Provider>
  );
};

export default App;
