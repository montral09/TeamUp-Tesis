import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/combinedReducers';

import { loadState, saveState } from '../auth/cookieStore';

const middlewares = [thunk];

export function configureStore(initialState) {
    const createdStore = createStore(rootReducer, initialState,
      compose(applyMiddleware(...middlewares)));
    return createdStore;
}

const store = configureStore(loadState());

export default store;

//export default store = createStore(rootReducer)