import { takeEvery, call, put } from "redux-saga/effects";
import { DATA_REQUESTED } from "../constants/action-types";
import { DATA_LOADED } from "../constants/action-types";
import { API_ERRORED } from "../constants/action-types";

/** take every action named DATA_REQUESTED and
 for each action of that type spin a worker saga */
export default function* watcherSaga() {
  yield takeEvery(DATA_REQUESTED, workerSaga);
}

/**  If no error then dispatch (put) a new action DATA_LOADED with a payload.
If an error then dispatch (put) a new action API_ERRORED, with a payload (the error) */
function* workerSaga() {
  try {
    const payload = yield call(getData);
    yield put({ type: DATA_LOADED, payload });
  } catch (e) {
    yield put({ type: API_ERRORED, payload: e });
  }
}
function getData() {
  return fetch('http://radiant-springs-38893.herokuapp.com/api/list/en',{
    method: 'GET',
    headers: {
      Accept: 'application/json',
    }
  }).then(response => {
      return response.json();
    }
  );
}
