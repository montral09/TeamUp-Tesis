import {callAPI} from '../../common/genericFunctions';
import translations from '../../common/translations';

export const logIn = (userData) => {
    return (dispatch, getState) =>{
        
        var objApi = {};
        objApi.objToSend = {
            Password: userData.password,
            Mail: userData.email
        };
        objApi.fetchUrl = "api/login";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_USRLOGSUCCESS : ''
        };
        objApi.functionAfterSuccess = "logIn";
        objApi.functionAfterError = "logIn";
        objApi.successMessage = "Bienvenid@ ";
        objApi.errorMSG= {
            ERR_MAILNOTVALIDATED : translations['es'].messages['ERR_MAILNOTVALIDATED'],
            ERR_USRMAILNOTEXIST : translations['es'].messages['ERR_USRMAILNOTEXIST'],
            ERR_USRWRONGPASS : translations['es'].messages['ERR_USRWRONGPASS']
        }
        objApi.dispatch = dispatch;
        objApi.typeSuccess = 'LOG_IN';
        objApi.typeError = 'LOG_IN_ERROR';
        callAPI(objApi, userData.bindThis);
    }
}

export const logOut = () =>{
    return {
         type: 'LOG_OUT'
    }
}

export const modifyData = (userData) =>{
    return {
         type: 'MODIFY_DATA', 
         userData: userData
    }
}

export const updateToken = (tokenObj) =>{
    return {
        type: 'TOKEN_UPDATED', 
        tokenObj: tokenObj
   }
}

export const changeLanguage = (systemLanguage) =>{
    return {
        type: 'LANGUAGE_UPDATED', 
        systemLanguage: systemLanguage
   }
}