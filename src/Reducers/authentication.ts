export interface AuthenticationState {
  id_token: string;
  access_token: string;
  expires_in: string;
  token_type: boolean;
}

interface UpdateAuthenticationAction {
  type: 'UPDATE_AUTHENTICATION';
  authentication: AuthenticationState;
}

interface ClearAuthentication {
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
