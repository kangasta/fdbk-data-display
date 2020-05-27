interface SettingsState {
  darkMode: boolean;
}

const initialState: SettingsState = {
  darkMode: false,
};

interface SetDarkModeAction {
  type: 'SET_DARK_MODE';
  darkMode: boolean;
}

export const settingsReducer = (
  state = initialState,
  action: SetDarkModeAction
): SettingsState => {
  switch (action.type) {
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.darkMode };
    default:
      return state;
  }
};

export default settingsReducer;
