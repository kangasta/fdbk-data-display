import { combineReducers } from 'redux';

import authentication from './authentication';
import query from './query';
import settings from './settings';
import topics from './topics';
import ui from './ui';

export const mainReducer = combineReducers({
  authentication,
  query,
  settings,
  topics,
  ui,
});
export type StateType = ReturnType<typeof mainReducer>;

export default mainReducer;
