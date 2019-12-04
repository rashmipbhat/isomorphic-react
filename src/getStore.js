// I REMOVED ALL ORIGIONAL COMMENTS
// I HAVE ADDED SOME MY OWN COMMENTS BELOW

import { createStore, combineReducers,applyMiddleware } from 'redux';
import { routerReducer as router, routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import fetchQuestionSaga from './sagas/fetch-question-saga';
import fetchQuestionsSaga from './sagas/fetch-questions-saga';
import { rootSaga } from "./module/root/rootSaga";
import axios from 'axios';

// WANT TO IMPORT MY OWN ROOT SAGA/REDUCER FROM "./MODULES/ROOT"
//import * as reducers from './reducers';
import reducers from "./modules/root/rootReducer";

export default function(history, defaultState = {}, req){

  // WANT CREATE A AXIOS INSTANCE WITH THE PROXY API SEPERATE
  // SOMEHOW OUR SAGAS NEED TO ALL GET THIS
  const axiosInstance = axios.create({
    baseURL: process.env.PROXY_API,
    headers: { cookie: req.get('cookie') || '' }
  });

  const middleware = routerMiddleware(history);

  const sagaMiddleware = createSagaMiddleware(); // HOW CAN BE PASS IN A AXIOS INSTANCE - PROXI API FOR SEPERATE API SERVER ?

  const middlewareChain = [middleware, sagaMiddleware];

  if(process.env.NODE_ENV === 'development') {
    const logger = createLogger();
    middlewareChain.push(logger);
  }

  const store = createStore(combineReducers({
    ...reducers,
    router
  }), defaultState,applyMiddleware(...middlewareChain));

  // THIS IS SOME CODE FROM ANOTHER TUTORIAL SERIES I HAVE BEEN PLAYING WITH
  // I SUPPOSE I AM HOPING THIS FUCNTION CAN CALL ALL REQUESTS TO FILL STATE UP WITH ALL REQUIRED DEPENDING ON THE ROUTE !!
  const runSagas = sagaMiddleware.run;

  // sagaMiddleware.run(fetchQuestionSaga);
  // sagaMiddleware.run(fetchQuestionsSaga);

  sagaMiddleware.run(rootSaga);

  return store;

}
