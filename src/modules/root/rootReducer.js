import { combineReducers } from "redux";
import questionReducer from "../question/questionReducer";

export const rootReducer = combineReducers({
  question: questionReducer
});
