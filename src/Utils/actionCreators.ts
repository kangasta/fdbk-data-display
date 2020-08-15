import { UpdateSettingsAction } from '../Reducers/settings';

export const setDarkMode = (darkMode: boolean): UpdateSettingsAction => ({
  type: 'UPDATE_SETTINGS',
  settings: { darkMode },
});
