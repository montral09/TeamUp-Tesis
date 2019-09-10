import { combineReducers } from 'redux';
import { IntlReducer as Intl } from 'react-redux-multilingual'

import loginReducer from './login/reducer';


const rootReducer = combineReducers({
	Intl,
    loginData: loginReducer
});

export default rootReducer;