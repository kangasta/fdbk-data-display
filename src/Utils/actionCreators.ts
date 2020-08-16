import {
  ClearAuthenticationAction,
  UpdateAuthenticationAction,
  AuthenticationState,
} from '../Reducers/authentication';
import { UpdateSettingsAction, SettingsState } from '../Reducers/settings';

export const clearAuthentication = (): ClearAuthenticationAction => ({
  type: 'CLEAR_AUTHENTICATION',
});

export const setAuthentication = (
  authentication: AuthenticationState
): UpdateAuthenticationAction => ({
  type: 'UPDATE_AUTHENTICATION',
  authentication,
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
