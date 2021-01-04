import { useState, useEffect, useMemo, useCallback } from 'react';
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
  lastUpdated?: string;
}

export type CheckType<DataType = unknown> = (
  data: DataType
) => string | null | undefined;

export const checkNoErrorKey = (data: any): string | null => data.error ?? null;

export function useApi<DataType = unknown>(
  path: string,
  checks?: CheckType<DataType>[]
): [DataType | undefined, StatusType, () => void] {
  const [data, setData] = useState<DataType>();
  const [status, setStatus] = useState<StatusType>(LOADING_STATUS);
  const updateStatus = (newStatus: StatusType) =>
    setStatus(({ lastUpdated }) => ({ lastUpdated, ...newStatus }));
  const headers = useAuthorizationHeader();

  const dispatch = useDispatch();
  const apiUrl = useSelector<StateType, string | undefined>(
    ({ settings }) => settings.apiUrl
  );

  const fetchData = useCallback(async () => {
    if (!apiUrl) {
      updateStatus({ error: API_NOT_CONFIGURED });
      return;
    }

    try {
      updateStatus(LOADING_STATUS);
      const url = joinPaths(apiUrl, path);
      const response = await fetch(url, {
        headers,
        mode: 'cors',
      });
      const responseData = await response.json();

      const hasErrors = [checkNoErrorKey, ...(checks ?? [])].some((check) => {
        const error = check(responseData);
        if (error) {
          updateStatus({ error });
        }
        return error;
      });

      if (hasErrors) {
        return;
      }

      setData(responseData);
      setStatus({ lastUpdated: new Date().toISOString() });
    } catch (_) {
      updateStatus({ error: API_FETCH_FAILED });
      dispatch(clearAuthentication());
    }
  }, [apiUrl, path, headers, checks, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => [data, status, fetchData], [data, status, fetchData]);
}
