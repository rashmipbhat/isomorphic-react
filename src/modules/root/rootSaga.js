import { all } from "redux-saga/effects";
import { questionSaga } from "../question/questionSaga";

export function* rootSaga() {
  yield all([
    questionSaga()
  ]);
}
