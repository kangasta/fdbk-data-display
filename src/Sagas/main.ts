import { call, put, select, takeLatest } from 'redux-saga/effects';

import { joinPaths } from '../Utils/queryUtils';
import { getAuthHeader, Headers } from '../Utils/useAuthorizationHeader';
import { API_FETCH_FAILED } from '../Utils/useApi';
import { StateType } from '../Reducers/main';
import {
  clearAuthentication,
  triggerUpdateTopics,
  updateTopics,
} from '../Utils/actionCreators';

const TOPICS_API_UNDEFINED =
  'Could not fetch topics from API because the API base URL is not defined.';

const getApiDetails = ({
  settings,
  authentication,
}: StateType): [string | undefined, boolean, Headers] => {
  const headers = getAuthHeader(
    authentication?.token_type,
    authentication?.id_token
  );

  return [settings.apiUrl, settings.fullApi, headers];
};

export function* fetchTopics(): any {
  const [apiUrl, fullApi, headers] = yield select(getApiDetails);
  if (!fullApi) {
    return;
  }

  if (!apiUrl) {
    yield put(updateTopics(undefined, { error: TOPICS_API_UNDEFINED }));
    return;
  }

  try {
    const response = yield call(fetch, joinPaths(apiUrl, 'topics'), {
      headers,
    });
    const topics = yield response.json();
    yield put(updateTopics(topics, {}));
  } catch (_) {
    yield put(updateTopics(undefined, { error: API_FETCH_FAILED }));
    yield put(clearAuthentication());
  }
}

export function* triggerFetchTopics() {
  yield put(triggerUpdateTopics());
}

export function* watchFetchTopics() {
  yield takeLatest('TRIGGER_UPDATE_TOPICS', fetchTopics);
  yield takeLatest('UPDATE_SETTINGS', triggerFetchTopics);
  yield put(triggerUpdateTopics());
}

export function* mainSaga() {
  yield call(watchFetchTopics);
}
