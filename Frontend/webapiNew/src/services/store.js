import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

import { loadState, saveState } from './auth/cookieStore';


const middlewares = [thunk];

export function configureStore(initialState) {
    const createdStore = createStore(reducers, initialState,
      compose(applyMiddleware(...middlewares)));
    return createdStore;
  }
  
const store = configureStore(loadState());

/*
store.subscribe(() => {
    saveState({
        loginReducer: store.getState().loginReducer,
    });
  });*/
//const store = createStore(reducers, applyMiddleware(thunk));

export default store;