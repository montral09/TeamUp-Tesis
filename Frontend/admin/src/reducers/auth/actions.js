import {
    LOG_IN,
    LOG_OUT,
    LOG_IN_ERROR,
    TOKEN_UPDATED } 
from "./actionTypes";

import { callAPI } from '../../config/genericFunctions'

// Here are all of the actions for account process, this is going to be called on login/logout page
export const logIn = (adminData) =>{
    return (dispatch, getState) =>{
        var objApi = {};
        objApi.objToSend = {
            Password: adminData.password,
            Mail: adminData.email
        };
        objApi.fetchUrl = "api/admin";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_USRLOGSUCCESS : 'Bienvenid@'
        };
        objApi.functionAfterSuccess = "logIn";
        objApi.functionAfterError = "logIn";
        objApi.errorMSG= {
            ERR_USRMAILNOTEXIST : 'Datos incorrectos',
            ERR_USRWRONGPASS : 'Datos incorrectos'
        }
        objApi.dispatch = dispatch;
        objApi.typeSuccess = LOG_IN;
        objApi.typeError = LOG_IN_ERROR;
        callAPI(objApi, adminData.bindThis);
    }
}

export const logOut = () =>{
    return {
         type: LOG_OUT
    }
}


export const updateToken = (tokenObj) =>{
    return {
        type: TOKEN_UPDATED, 
        tokenObj: tokenObj
   }
}
