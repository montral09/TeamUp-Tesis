
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    LOG_IN_ERROR } 
from "./actionTypes";

import { toast } from 'react-toastify';

import { loadState, saveState } from './cookieStore';

const initState = {
    login_status : 'NOT_LOGGED_IN',
    adminData : {},
    admTokenObj : {},
    messageObj: {},
}

const loginReducer = (state = initState, action) =>{
    console.log("action: ");console.log(action);
    
    let newStateObj = {...state}
    switch(action.type){
        case LOG_IN : 
            console.log("This is the token obj:");
            console.log(action.admTokenObj)
            newStateObj = {
                ...state,
                login_status: 'LOGGED_IN',
                adminData: action.adminData,
                admTokenObj: action.admTokenObj,
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
                adminData: [],
                admTokenObj: {}
            }
            saveState(newStateObj);
        break;
    }
    console.log("newStateObj: ");console.log(newStateObj);
    return newStateObj;
}

export default loginReducer