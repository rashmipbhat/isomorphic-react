import { takeEvery, put } from 'redux-saga/effects'
import fetch from 'isomorphic-fetch';

// WANT TO CONTINUE USE AXIOS - NEED ADD THE PROXI API URL FROM PROCESS.ENV
// import axios from "axios";
const { PROXY_API } = process.env;

import {
  fetchQuestionRequest, fetchQuestionSuccess, fetchQuestionFailure
  fetchQuestionsRequest, fetchQuestionsSuccess, fetchQuestionsFailure
} from "./questionReducer";

function * fetchQuestionWorker ({ payload }) {
    const { question_id } = payload;
    const raw = yield fetch(`/api/questions/${question_id}`);
    const json = yield raw.json();
    const question = json.items[0];
    yield put({type:`FETCHED_QUESTION`, question});
}

function * fetchQuestionsWorker () {
    yield take(`REQUEST_FETCH_QUESTIONS`);
    const raw = yield fetch('/api/questions');
    const json = yield raw.json();
    const questions = json.items;
    yield put({type:`FETCHED_QUESTIONS`, questions});
}

export function* questionSaga() {
  yield all([
    takeEvery(fetchQuestionRequest, fetchQuestionWorker),
    takeEvery(fetchQuestionsRequest, fetchQuestionsWorker)
  ]);
}
