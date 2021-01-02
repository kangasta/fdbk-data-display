import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { StateType } from '../Reducers/main';

export const useTitle = (title: string): void => {
  const mainTitle = useSelector<StateType, string>(
    ({ settings }) => settings.title
  );

  useEffect(() => {
    document.title = `${mainTitle} ${title}`;
  });
};
