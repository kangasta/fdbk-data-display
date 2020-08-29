import { combineReducers } from 'redux';

import authentication from './authentication';
import query from './query';
import settings from './settings';

export const mainReducer = combineReducers({ authentication, query, settings });
export type StateType = ReturnType<typeof mainReducer>;

export default mainReducer;
