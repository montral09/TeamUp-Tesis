import { combineReducers } from 'redux';
import { IntlReducer as Intl } from 'react-redux-multilingual'

import loginReducer from './login/reducer';
import accountReducer from './account/reducer';

const rootReducer = combineReducers({
	Intl,
    loginData: loginReducer,
    accountData: accountReducer
});

export default rootReducer;