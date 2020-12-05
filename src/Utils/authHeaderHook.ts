import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StateType } from '../Reducers/main';
import { getLoginUrl } from './AuthenticationLinks';

export type Headers = { [key: string]: string };
export const useAuthorizationHeader = (): Headers | undefined => {
  const token = useSelector<StateType, string | undefined>(
    (state) => state.authentication?.id_token
  );
  const tokenType = useSelector<StateType, string | undefined>(
    (state) => state.authentication?.token_type
  );

  const requireAuth = useSelector<StateType, boolean>(
    (state) => state.settings.requireAuth
  );
  const authUrl = useSelector<StateType, string | undefined>(
    (state) => state.settings.authUrl
  );
  const clientId = useSelector<StateType, string | undefined>(
    (state) => state.settings.clientId
  );

  const authHeader = useMemo(
    () => ({
      Authorization: `${tokenType} ${token}`,
    }),
    [tokenType, token]
  );

  if (token && tokenType) {
    return authHeader;
  }

  if (requireAuth && authUrl && clientId) {
    window.location.replace(getLoginUrl(authUrl, clientId));
  }

  return undefined;
};
