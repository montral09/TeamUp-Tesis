
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    MODIFY_DATA } 
from "./actionTypes";
import { loadState, saveState } from '../auth/cookieStore';

const initState = {
    login_status : 'NOT_LOGGED_IN',
    userData : {},
    tokenObj : {}
}

const loginReducer = (state = initState, action) =>{
    console.log("action: ");console.log(action);
    
    let newStateObj = {...state}
    switch(action.type){
        case LOG_IN : 
            console.log("This is the token obj:");
            console.log(action.tokenObj)
            newStateObj = {
                ...state,
                login_status: 'LOGGED_IN',
                userData: action.userData,
                tokenObj: action.tokenObj
            }
            saveState(newStateObj);
        break;
        case LOG_OUT : 
            newStateObj = {
                ...state,
                login_status: 'NOT_LOGGED_IN',
                userData: [],
                tokenObj: {}
            }
            saveState(newStateObj);
        break;
        case MODIFY_DATA : 
            newStateObj = {
                ...state,
                userData: action.userData
            }
        break;
    }
    console.log("newStateObj: ");console.log(newStateObj);
    return newStateObj;
}

export default loginReducer