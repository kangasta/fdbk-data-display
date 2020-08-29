export type QueryMode = 'From now' | 'Month' | 'Query string';
export type FromNow =
  | 'Last 12 hours'
  | 'Last day'
  | 'Last 3 days'
  | 'Last 7 days';

export interface QueryState {
  mode: QueryMode;
  queryString?: string;
  fromNow: FromNow;
  year: number;
  month: number;
}

const now = new Date();
const defaultQueryState: QueryState = {
  mode: 'From now',
  fromNow: 'Last day',
  year: now.getFullYear(),
  month: now.getMonth() + 1,
};

export interface UpdateQueryAction {
  type: 'UPDATE_QUERY';
  query: Partial<QueryState>;
}

export interface ClearQueryAction {
  type: 'CLEAR_QUERY';
}

export const queryReducer = (
  state = defaultQueryState,
  action: UpdateQueryAction | ClearQueryAction
): QueryState => {
  switch (action.type) {
    case 'UPDATE_QUERY':
      return { ...state, ...action.query };
    case 'CLEAR_QUERY':
      return defaultQueryState;
    default:
      return state;
  }
};

export default queryReducer;
