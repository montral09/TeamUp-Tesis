import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import reducers from '../reducers';
import thunk from 'redux-thunk';
import { loadState } from '../reducers/auth/cookieStore';

const middlewares = [thunk];

export function configureStore(initialState) {
    const createdStore = createStore(combineReducers({
      ...reducers
    }), initialState,
      compose(applyMiddleware(...middlewares)));
    return createdStore;
  }
  
const store = configureStore(loadState());

export default store;

