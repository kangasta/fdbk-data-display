import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StateType } from '../Reducers/main';
import { clearAuthentication } from './actionCreators';
import { joinPaths } from './queryUtils';
import { useAuthorizationHeader } from './useAuthorizationHeader';

export const API_NOT_CONFIGURED = 'API not configured. Can not load data.';
export const API_FETCH_FAILED = 'Was not able to fetch data from the API.';
export const LOADING_STATUS = {
  loading: 'Loading data from API.',
};

export interface StatusType {
  error?: string;
  loading?: string;
}

export type CheckType<DataType = unknown> = (
  data: DataType
) => string | null | undefined;

export function useApi<DataType = unknown>(
  path: string,
  checks: CheckType<DataType>[] = []
): [DataType | undefined, StatusType] {
  const [data, setData] = useState<DataType>();
  const [status, setStatus] = useState<StatusType>(LOADING_STATUS);
  const headers = useAuthorizationHeader();

  const dispatch = useDispatch();
  const apiUrl = useSelector<StateType, string | undefined>(
    ({ settings }) => settings.apiUrl
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!apiUrl) {
        setStatus({ error: API_NOT_CONFIGURED });
        return;
      }

      try {
        setStatus(LOADING_STATUS);
        const url = joinPaths(apiUrl, path);
        const response = await fetch(url, {
          headers,
          mode: 'cors',
        });
        const responseData = await response.json();

        const hasErrors = checks.some((check) => {
          const error = check(responseData);
          if (error) {
            setStatus({ error });
          }
          return error;
        });

        if (hasErrors) {
          return;
        }

        setData(responseData);
        setStatus({});
      } catch (_) {
        setStatus({ error: API_FETCH_FAILED });
        dispatch(clearAuthentication());
      }
    };
    fetchData();
  }, [apiUrl, path, headers, checks, dispatch]);

  return useMemo(() => [data, status], [data, status]);
}
