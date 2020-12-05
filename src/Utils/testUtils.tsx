import React from 'react';
import { Provider, ProviderProps } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

export const TEST_ID_NAME = 'Test Dude';
export const TEST_ID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ2l2ZW5fbmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IkR1ZGUiLCJpYXQiOjE1MTYyMzkwMjJ9.SRHYhnDAuP2qB1dHTo4-aCS8gO5nTpzZKEIKXdtMVdQ';

export const AUTHENTICATION_STATE = {
  id_token: TEST_ID_TOKEN,
  access_token: 'ACCESS_TOKEN',
  expires_in: 3600,
  token_type: 'Bearer',
};

export const getKeyUpEvent = (value: string, key = 'Enter') => ({
  key,
  target: { value },
});

interface TestWrapperOwnProps {
  children: React.ReactNode;
}
export type TestWrapperProps = Partial<ProviderProps> & TestWrapperOwnProps;

const TestProvider = ({
  store,
  children,
}: TestWrapperProps): React.ReactElement =>
  store ? <Provider store={store}>{children}</Provider> : <>{children}</>;

const testTheme = createMuiTheme();
export const TestWrapper = ({ store, children }: TestWrapperProps) => (
  <TestProvider store={store}>
    <ThemeProvider theme={testTheme}>
      <Router>
        <Route>{children}</Route>
      </Router>
    </ThemeProvider>
  </TestProvider>
);
