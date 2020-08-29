import {
  ClearAuthenticationAction,
  UpdateAuthenticationAction,
  AuthenticationState,
} from '../Reducers/authentication';
import { UpdateSettingsAction, SettingsState } from '../Reducers/settings';
import {
  UpdateQueryAction,
  ClearQueryAction,
  QueryState,
} from '../Reducers/query';

export const clearAuthentication = (): ClearAuthenticationAction => ({
  type: 'CLEAR_AUTHENTICATION',
});

export const setAuthentication = (
  authentication: AuthenticationState
): UpdateAuthenticationAction => ({
  type: 'UPDATE_AUTHENTICATION',
  authentication,
});

export const clearQuery = (): ClearQueryAction => ({
  type: 'CLEAR_QUERY',
});

export const setQuery = (query: Partial<QueryState>): UpdateQueryAction => ({
  type: 'UPDATE_QUERY',
  query,
});

export const setDarkMode = (darkMode: boolean): UpdateSettingsAction => ({
  type: 'UPDATE_SETTINGS',
  settings: { darkMode },
});

export const setSettings = (
  settings: Partial<SettingsState>
): UpdateSettingsAction => ({
  type: 'UPDATE_SETTINGS',
  settings,
});
