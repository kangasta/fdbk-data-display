import React, { useEffect } from 'react';
import { createStore } from 'redux';
import { render } from '@testing-library/react';

import { AUTHENTICATION_STATE, TestWrapper } from '../../Utils/testUtils';
import {
  useAuthorizationHeader,
  Headers,
} from '../../Utils/useAuthorizationHeader';
import mainReducer from '../../Reducers/main';
import { setAuthentication } from '../../Utils/actionCreators';

interface HeaderTestComponentProps {
  changedCallback: (headers?: Headers) => void;
  anotherProp: number;
}
const HeaderTestComponent = ({
  changedCallback,
  anotherProp,
}: HeaderTestComponentProps) => {
  const header = useAuthorizationHeader();

  useEffect(() => {
    changedCallback(header);
  }, [changedCallback, header]);

  return (
    <div>
      <h1>Render {anotherProp}</h1>
      {JSON.stringify(header)}
    </div>
  );
};

it('Headers value does not change if token does not change', () => {
  const callback = jest.fn();

  const store = createStore(mainReducer);
  store.dispatch(setAuthentication(AUTHENTICATION_STATE));

  const { rerender } = render(
    <TestWrapper store={store}>
      <HeaderTestComponent changedCallback={callback} anotherProp={1} />
    </TestWrapper>
  );

  expect(callback).toHaveBeenCalled();

  rerender(
    <TestWrapper store={store}>
      <HeaderTestComponent changedCallback={callback} anotherProp={2} />
    </TestWrapper>
  );

  expect(callback).toHaveBeenCalledTimes(1);
});
