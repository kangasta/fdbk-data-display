import { Topic } from '../Types/Topic';
import { StatusType } from '../Utils/useApi';

export interface TopicsState {
  data: Topic[];
  status: StatusType;
}

export interface UpdateTopicsAction {
  type: 'UPDATE_TOPICS';
  topics: Partial<TopicsState>;
}

export interface TriggerUpdateTopicsAction {
  type: 'TRIGGER_UPDATE_TOPICS';
  loading?: string;
}

const initialState: TopicsState = {
  data: [],
  status: {},
};

export const topicsReducer = (
  state = initialState,
  action: UpdateTopicsAction | TriggerUpdateTopicsAction
): TopicsState => {
  switch (action.type) {
    case 'UPDATE_TOPICS':
      return {
        data: action.topics.data ?? state.data,
        status: action.topics.status
          ? { lastUpdated: state.status.lastUpdated, ...action.topics.status }
          : state.status,
      };
    case 'TRIGGER_UPDATE_TOPICS':
      return {
        ...state,
        status: { loading: action.loading ?? 'Loading topics list' },
      };
    default:
      return state;
  }
};

export default topicsReducer;
