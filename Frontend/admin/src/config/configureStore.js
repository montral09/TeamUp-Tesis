import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import reducers from '../reducers';
import thunk from 'redux-thunk';


const middlewares = [thunk];

export default function configureStore() {
  return createStore(
    combineReducers({
      ...reducers
    }),
    {},
    compose(applyMiddleware(...middlewares))
  );
}