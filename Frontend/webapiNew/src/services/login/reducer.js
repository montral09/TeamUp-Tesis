
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    MODIFY_DATA } 
from "./actionTypes";

const initState = {
    login_status : 'NOT_LOGGED_IN',
    userData : {}
}

const loginReducer = (state = initState, action) =>{
    console.log("action: ");console.log(action);
    
    let newStateObj = {...state}
    switch(action.type){
        case LOG_IN : 
            newStateObj = {
                ...state,
                login_status: 'LOGGED_IN',
                userData: action.userData
            }
        break;
        case LOG_OUT : 
            newStateObj = {
                ...state,
                login_status: 'NOT_LOGGED_IN',
                userData: []
            }
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