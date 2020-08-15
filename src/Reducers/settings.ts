export const SETTINGS_KEY = 'settings';

export interface SettingsState {
  apiUrl?: string;
  authUrl?: string;
  clientId?: string;
  darkMode: boolean;
  title: string;
}

const defaultConfig: SettingsState = {
  darkMode: false,
  title: 'fdbk-data-display',
};

const savedConfigString = window.localStorage.getItem(SETTINGS_KEY);
const savedConfig: SettingsState = savedConfigString
  ? JSON.parse(savedConfigString)
  : {};

let initialState: SettingsState;
try {
  // config is defined in config.js, which is loaded in index.html
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  initialState = { ...defaultConfig, ...config, ...savedConfig };
} catch (_) {
  initialState = { ...defaultConfig, ...savedConfig };
}

interface UpdateSettingsAction {
  type: 'UPDATE_SETTINGS';
  settings: Partial<SettingsState>;
}

export const settingsReducer = (
  state = initialState,
  action: UpdateSettingsAction
): SettingsState => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.settings };
    default:
      return state;
  }
};

export default settingsReducer;
