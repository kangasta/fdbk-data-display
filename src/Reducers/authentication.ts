export interface AuthenticationState {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface UpdateAuthenticationAction {
  type: 'UPDATE_AUTHENTICATION';
  authentication: AuthenticationState;
}

export interface ClearAuthentication {
  type: 'CLEAR_AUTHENTICATION';
}

export const authenticationReducer = (
  state: AuthenticationState | null = null,
  action: ClearAuthentication | UpdateAuthenticationAction
): AuthenticationState | null => {
  switch (action.type) {
    case 'UPDATE_AUTHENTICATION':
      return { ...(state || {}), ...action.authentication };
    case 'CLEAR_AUTHENTICATION':
      return null;
    default:
      return state;
  }
};

export default authenticationReducer;
