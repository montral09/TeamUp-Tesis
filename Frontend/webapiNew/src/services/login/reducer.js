
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    MODIFY_DATA,
    LOG_IN_ERROR,
    TOKEN_UPDATED } 
from "./actionTypes";
import { toast } from 'react-toastify';
import { loadState, saveState } from '../auth/cookieStore';

const initState = {
    login_status : 'NOT_LOGGED_IN',
    userData : {},
    tokenObj : {},
    messageObj: {},
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
                tokenObj: action.tokenObj,
            }
            toast.success(action.messageObj.successMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            saveState(newStateObj);
        break;
        case LOG_IN_ERROR :
            newStateObj = {
                login_status: 'NOT_LOGGED_IN',
                ...state,
            }
            toast.error(action.messageObj.errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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
            saveState(newStateObj);
        break;
        case TOKEN_UPDATED : 
            newStateObj = {
                ...state,
                tokenObj: action.tokenObj
            }
            saveState(newStateObj);
        break;
    }
    console.log("newStateObj: ");console.log(newStateObj);
    return newStateObj;
}

export default loginReducer