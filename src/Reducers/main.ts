import { combineReducers } from "redux";

import settingsReducer from "./settings";

export const mainReducer = combineReducers({ settings: settingsReducer });
export type StateType = ReturnType<typeof mainReducer>;

export default mainReducer;
