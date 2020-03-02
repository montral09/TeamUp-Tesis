
import {
    LOG_IN,
    LOG_OUT,
    MODIFY_DATA,
    LOG_IN_ERROR,
    TOKEN_UPDATED,
    LOCALE_UPDATED } 
from "./actionTypes";
import { loadState, saveState } from '../auth/cookieStore';

const initState = {
    login_status : 'NOT_LOGGED_IN',
    userData : {},
    tokenObj : {},
    messageObj: {},
    locale: 'es'
}

const loginReducer = (state = initState, action) =>{    
    let newStateObj = {...state}
    switch(action.type){
        case LOG_IN : 
            newStateObj = {
                ...state,
                login_status: 'LOGGED_IN',
                userData: action.userData,
                tokenObj: action.tokenObj,
            }
            saveState(newStateObj);
        break;
        case LOG_IN_ERROR :
            newStateObj = {
                login_status: 'NOT_LOGGED_IN',
                ...state,
            }
        break; 
        case LOG_OUT : 
            newStateObj = {
                ...state,
                login_status: 'NOT_LOGGED_IN',
                userData: {},
                tokenObj: {}
            }
            saveState(newStateObj);
        break;
        case MODIFY_DATA : 
            newStateObj = {
                ...state,
                userData: action.userData
            }
            saveState(newStateObj);
        break;
        case TOKEN_UPDATED : 
            newStateObj = {
                ...state,
                tokenObj: action.tokenObj
            }
            saveState(newStateObj);
        break;
        case LOCALE_UPDATED : 
            newStateObj = {
                ...state,
                locale: action.locale
            }
            saveState(newStateObj);
        break;
    }
    return newStateObj;
}

export default loginReducer