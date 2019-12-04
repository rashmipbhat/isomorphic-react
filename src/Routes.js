import React from 'react';
import App from './App';

import QuestionList from "./components/QuestionList";
import QuestionDetail from "./components/QuestionDetail";

import { fetchQuestionRequest } from "./module/questions/questionReducer";
import { fetchQuestionsRequest } from "./module/questions/questionsReducer";

export default [
  {
    ...App,
    routes: [
      {
        path: "/",
        exact: true,
        ...QuestionList
      },
      {
        path: "/question/:id",
        ...QuestionDetail
      }
    ]
  }
];
