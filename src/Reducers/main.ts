import { combineReducers } from 'redux';

import authentication from './authentication';
import settings from './settings';

export const mainReducer = combineReducers({ authentication, settings });
export type StateType = ReturnType<typeof mainReducer>;

export default mainReducer;
