
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    MODIFY_DATA,
    LOG_IN_ERROR,
    TOKEN_UPDATED,
    LOCALE_UPDATED } 
from "./actionTypes";
import { callAPI } from '../../services/common/genericFunctions';

// Here are all of the actions for account process, this is going to be called on login/logout page
export const logIn = (userData) =>{
    return (dispatch, getState) =>{
        var objApi = {};
        objApi.objToSend = {
            Password: userData.password,
            Mail: userData.email
        };
        objApi.fetchUrl = "api/login";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_USRLOGSUCCESS : userData.translate('SUCC_USRLOGSUCCESS')
        };
        objApi.functionAfterSuccess = "logIn";
        objApi.functionAfterError = "logIn";
        objApi.errorMSG= {
            ERR_MAILNOTVALIDATED : userData.translate('ERR_MAILNOTVALIDATED'),
            ERR_USRWRONGPASS : userData.translate('ERR_USRWRONGPASS')
        }
        objApi.dispatch = dispatch;
        objApi.typeSuccess = LOG_IN;
        objApi.typeError = LOG_IN_ERROR;
        callAPI(objApi, userData.bindThis);
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

export const updateToken = (tokenObj) =>{
    return {
        type: TOKEN_UPDATED, 
        tokenObj: tokenObj
   }
}

export const updateLocale = (locale) =>{
    return {
        type: LOCALE_UPDATED, 
        locale: locale
   }
}