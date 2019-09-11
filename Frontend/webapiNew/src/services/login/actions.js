
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN } 
from "./actionTypes";

// Here are all of the actions for login process, this is going to be called on login/logout page
export const logIn = (userData) =>{
    return {
         type: LOG_IN, 
         userData: userData
    }
}

export const logOut = () =>{
    return {
         type: LOG_OUT
    }
}