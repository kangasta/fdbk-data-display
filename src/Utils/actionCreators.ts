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
import {
  TopicsState,
  TriggerUpdateTopicsAction,
  UpdateTopicsAction,
} from '../Reducers/topics';
import { UiState, UpdateUiAction } from '../Reducers/ui';

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

export const setSettings = (
  settings: Partial<SettingsState>
): UpdateSettingsAction => ({
  type: 'UPDATE_SETTINGS',
  settings,
});

export const setDarkMode = (darkMode: boolean): UpdateSettingsAction =>
  setSettings({ darkMode });

export const triggerUpdateTopics = (
  message?: string
): TriggerUpdateTopicsAction => ({
  type: 'TRIGGER_UPDATE_TOPICS',
  loading: message,
});

export const updateTopics = (
  data?: TopicsState['data'],
  status?: TopicsState['status']
): UpdateTopicsAction => ({
  type: 'UPDATE_TOPICS',
  topics: { data, status },
});

export const setUi = (ui: Partial<UiState>): UpdateUiAction => ({
  type: 'UPDATE_UI',
  ui,
});

export const setShowSideDrawer = (showSideDrawer: boolean) =>
  setUi({ showSideDrawer });
