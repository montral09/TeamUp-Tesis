
import {
    LOG_IN,
    LOG_OUT,
    CHECK_LOGIN,
    MODIFY_DATA,
    LOG_IN_ERROR,
    TOKEN_UPDATED,
    LOCALE_UPDATED } 
from "./actionTypes";

// Here are all of the actions for account process, this is going to be called on login/logout page
export const logIn = (userData) =>{
    return (dispatch, getState) =>{
        
        fetch('https://localhost:44372/api/login', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

            body: JSON.stringify({
                Password: userData.password,
                Mail: userData.email
            })
        }).then(response => response.json()).then(data => {
            //this.setState({isLoading: false, buttonIsDisable:false});
            console.log("logIn - data:");
            console.log(data);
            if (data.responseCode == "SUCC_USRLOGSUCCESS") {
                let originalDate = new Date();
                let quinceMinDateTime = new Date(originalDate.getTime() + 15*60000);
                let cincoDiasDateTime = new Date(originalDate.getTime() + 7200*60000);
                let tokenObj = {
                    accesToken : data.AccessToken,
                    accesTokenExp : quinceMinDateTime,
                    refreshToken : data.RefreshToken,
                    refreshTokenExp: cincoDiasDateTime
                }
                //this.props.logIn(data.voUserLog, tokenObj); // this is calling the reducer to store the data on redux Store
                //this.props.history.push('/');
                dispatch({ type: LOG_IN, userData: data.voUserLog, tokenObj: tokenObj, messageObj: { responseCode: "SUCC_USRLOGSUCCESS", successMessage: "Bienvenid@,  "+data.voUserLog.Name}});
            } else if(data.responseCode ==  "ERR_MAILNOTVALIDATED"){
                dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_MAILNOTVALIDATED", errorMessage: "Correo pendiente de validar "}});
            }else{
                dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_USRWRONGPASS", errorMessage: "Datos incorrectos"}});
            }
        }
        ).catch(error => {
            /*this.setState({isLoading: false, buttonIsDisable:false});*/
            dispatch({ type: LOG_IN_ERROR, messageObj: { responseCode: "ERR_SYSTEM_ERROR", errorMessage: "Internal error"}});
        }
        )
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