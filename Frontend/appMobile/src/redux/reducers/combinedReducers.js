import { combineReducers } from 'redux';

import loginReducer from './accountReducer';
import registerReducer from './registerReducer';

const rootReducer = combineReducers({
    loginData: loginReducer,
    accountData: registerReducer
});

export default rootReducer;