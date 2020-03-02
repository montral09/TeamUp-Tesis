import { callAPI } from '../common/genericFunctions';

// Here are all of the actions for account process, this is going to be called on register/modify
export const registerUser = (userData) =>{
    // Return function to use with thunk (for async call)
    return (dispatch, getState) =>{
        //Call to API
        var objApi = {};
        objApi.objToSend = userData;
        objApi.fetchUrl = "api/user";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_USRCREATED : userData.translate('SUCC_USRCREATED')
        };
        objApi.functionAfterSuccess = "registerUser";
        objApi.functionAfterError = "registerUser";
        objApi.errorMSG= {
            ERR_MAILALREADYEXIST : userData.translate('ERR_MAILALREADYEXIST')
        }
        objApi.dispatch = dispatch;
        objApi.typeSuccess = 'REGISTER_USER';
        objApi.typeError = 'REGISTER_USER_ERROR';
        callAPI(objApi, userData.bindThis);

    }
}