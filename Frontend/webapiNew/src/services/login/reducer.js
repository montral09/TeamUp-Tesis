
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN } 
from "./actionTypes";

const initState = {
    login_status : 'NOT_LOGGED_IN',
    userData : {}
}

const loginReducer = (state = initState, action) =>{
    console.log(action);
    if(action.type == LOG_IN){
        return{
            ...state,
            login_status: 'LOGGED_IN',
            userData: action.userData
        }
    }
    return state;
}

export default loginReducer