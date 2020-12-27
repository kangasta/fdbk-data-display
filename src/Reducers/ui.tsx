export interface UiState {
  showSideDrawer: boolean;
}

export interface UpdateUiAction {
  type: 'UPDATE_UI';
  ui: Partial<UiState>;
}
const initialState: UiState = {
  showSideDrawer: false,
};

export const uiReducer = (
  state = initialState,
  action: UpdateUiAction
): UiState => {
  switch (action.type) {
    case 'UPDATE_UI':
      return { ...state, ...action.ui };
    default:
      return state;
  }
};

export default uiReducer;
