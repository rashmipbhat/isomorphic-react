import { createAction, handleActions } from "redux-actions";
import updateHelper from "immutability-helper";

export const fetchQuestionRequest = createAction("FETCH_QUESTION_REQUEST");
export const fetchQuestionSuccess = createAction("FETCH_QUESTION_SUCCESS");
export const fetchQuestionFailure = createAction("FETCH_QUESTION_FAILURE");

export const fetchQuestionsRequest = createAction("FETCH_QUESTIONS_REQUEST");
export const fetchQuestionsSuccess = createAction("FETCH_QUESTIONS_SUCCESS");
export const fetchQuestionsFailure = createAction("FETCH_QUESTIONS_FAILURE");

const initialState = {
  questions: [],
  fetching: false,
  error: null
};

export default handleActions(
  {

    [fetchQuestionRequest]: state => update(state, { fetching: { $set: true } }),
    [fetchQuestionSuccess]: (state, { payload }) => {
      // THIS IS OK FOR THE MOMENT
      const index = state.question.questions.findIndex(q => q.id === payload.question.id);
      if (index >= 0) {
        return update(state, {
          questions: {
            [index]: {
              $set: payload.question
            }
          }
          fetching: { $set: false }
        });
      }
      else {
        update(state, {
          questions: {
            $push: [payload.question]
          }
          fetching: { $set: false }
        })
      }
    },
    [fetchQuestionFailure]: (state, { payload }) =>
      update(state, {
        error: { $set: payload },
        fetching: { $set: false }
      }),

    [fetchQuestionsRequest]: state => update(state, { fetching: { $set: true } }),
    [fetchQuestionsSuccess]: (state, { payload }) =>
      update(state, {
        questions: {
          $set: payload.questions
        }
      }),
    [fetchQuestionsFailure]: (state, { payload }) =>
      update(state, {
        error: { $set: payload },
        fetching: { $set: false }
      }),

  },
  initialState
);

export const getQuestions = state => state.questions.questions;
export const getQuestions = (state, id) => state.question.questions.find(q => q.id === id);
