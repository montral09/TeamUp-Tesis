
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    MODIFY_DATA } 
from "./actionTypes";

// Here are all of the actions for account process, this is going to be called on login/logout page
export const logIn = (userData, tokenObj) =>{
    return {
         type: LOG_IN, 
         userData: userData,
         tokenObj: tokenObj
    }
}

export const logOut = () =>{
    return {
         type: LOG_OUT
    }
}

export const modifyData = (userData) =>{
    return {
         type: MODIFY_DATA, 
         userData: userData
    }
}
